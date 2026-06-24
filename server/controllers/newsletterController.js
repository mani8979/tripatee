import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  const { email } = req.body;

  try {
    const subscribed = await Newsletter.findOne({ email });
    if (subscribed) {
      res.status(400);
      throw new Error('Email is already subscribed to our newsletter');
    }

    await Newsletter.create({ email });

    res.status(201).json({
      message: 'Thank you for subscribing to the Tripatee Newsletter!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({}).sort({ subscribedAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    next(error);
  }
};
