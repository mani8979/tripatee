import Contact from '../models/Contact.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: 'Your inquiry has been submitted. We will contact you shortly!',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getInquiries = async (req, res, next) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark inquiry as read (Admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      message: 'Inquiry marked as read',
      contact: message,
    });
  } catch (error) {
    next(error);
  }
};
