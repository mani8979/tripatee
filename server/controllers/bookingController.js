import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  const { packageId, travelersCount, travelersDetails, bookingDate } = req.body;

  try {
    const tourPackage = await Package.findById(packageId).populate('destination');
    if (!tourPackage) {
      res.status(404);
      throw new Error('Tour package not found');
    }

    if (!travelersDetails || travelersDetails.length !== Number(travelersCount)) {
      res.status(400);
      throw new Error('Please provide details for all travelers');
    }

    const totalAmount = tourPackage.price * Number(travelersCount);

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelersCount: Number(travelersCount),
      travelersDetails,
      bookingDate,
      totalAmount,
    });

    // Populate package details for email/response
    const populatedBooking = await booking.populate({
      path: 'package',
      populate: { path: 'destination' },
    });

    // Send email notification to user
    const emailMessage = `Hello ${req.user.name},\n\nYour booking for the package "${tourPackage.title}" has been successfully created. We have received your order!\n\nBooking Details:\n- Package: ${tourPackage.title}\n- Travelers: ${travelersCount}\n- Date: ${new Date(bookingDate).toLocaleDateString()}\n- Total Cost: $${totalAmount}\n- Status: Pending Payment\n\nThank you for choosing Tripatee!`;
    
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Tripatee Booking Confirmation - Pending - ${tourPackage.title}`,
        message: emailMessage,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #0D6EFD;">Booking Confirmation</h2>
            <p>Dear ${req.user.name},</p>
            <p>Your booking for the package <strong>${tourPackage.title}</strong> is registered. Details are provided below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #eee;"><strong>Destination</strong></td>
                <td style="padding: 10px; border: 1px solid #eee;">${tourPackage.destination.name}, ${tourPackage.destination.country}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #eee;"><strong>Travelers Count</strong></td>
                <td style="padding: 10px; border: 1px solid #eee;">${travelersCount}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #eee;"><strong>Booking Date</strong></td>
                <td style="padding: 10px; border: 1px solid #eee;">${new Date(bookingDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #eee;"><strong>Total Amount</strong></td>
                <td style="padding: 10px; border: 1px solid #eee; color: #00C2A8; font-weight: bold;">$${totalAmount}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #eee;"><strong>Booking Status</strong></td>
                <td style="padding: 10px; border: 1px solid #eee; color: #FFB703; font-weight: bold;">Pending Payment</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">We look forward to hosting you on this journey!</p>
            <p>Best regards,<br/>The Tripatee Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send booking creation email:', emailErr.message);
    }

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'package',
        populate: { path: 'destination' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'package',
        populate: { path: 'destination' },
      });

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Allow only owner or Admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('package');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check user authority
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate({
        path: 'package',
        populate: { path: 'destination' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  const { status, paymentStatus } = req.body;

  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('package');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    booking.status = status || booking.status;
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    
    // Automatically update status to confirmed if payment status goes paid
    if (paymentStatus === 'paid' && status === 'pending') {
      booking.status = 'confirmed';
    }

    await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};
