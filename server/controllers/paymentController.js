import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Process a simulated payment
// @route   POST /api/payments/charge
// @access  Private
export const processPayment = async (req, res, next) => {
  const { bookingId, paymentMethod } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate('package').populate('user');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Booking is already paid');
    }

    // Generate mock transaction details
    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    // Create payment entry
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: 'USD',
      status: 'completed',
      transactionId,
      paymentMethod: paymentMethod || 'Simulated Credit Card',
    });

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // Send confirmation email
    const emailMessage = `Dear ${booking.user.name},\n\nWe have successfully received your payment of $${booking.totalAmount} for your trip "${booking.package.title}".\n\nTransaction ID: ${transactionId}\nPayment Method: ${payment.paymentMethod}\nBooking Status: Confirmed\n\nGet ready for your next adventure with Tripatee!\n\nBest regards,\nThe Tripatee Team`;

    try {
      await sendEmail({
        email: booking.user.email,
        subject: `Tripatee Payment Success - Ticket Confirmed - ${booking.package.title}`,
        message: emailMessage,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #00C2A8;">Payment Successful!</h2>
            <p>Dear ${booking.user.name},</p>
            <p>We are pleased to confirm receipt of your payment for <strong>${booking.package.title}</strong>.</p>
            <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
              <p style="margin: 5px 0;"><strong>Amount Paid:</strong> <span style="color: #00C2A8; font-weight: bold;">$${booking.totalAmount} USD</span></p>
              <p style="margin: 5px 0;"><strong>Booking Status:</strong> <span style="color: #0D6EFD; font-weight: bold;">Confirmed</span></p>
            </div>
            <p>Your tickets and travel itinerary are now active. You can view them anytime in your profile dashboard.</p>
            <p>Thank you for traveling with Tripatee!</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send payment success email:', emailErr.message);
    }

    res.status(200).json({
      message: 'Payment processed successfully',
      payment,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
export const getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({
        path: 'booking',
        populate: { path: 'package' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};
