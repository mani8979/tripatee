import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';

// @desc    Create a new package review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  const { packageId, rating, comment } = req.body;

  try {
    const tourPackage = await Package.findById(packageId);
    if (!tourPackage) {
      res.status(404);
      throw new Error('Tour package not found');
    }

    // Verify user actually booked this package (optional, but premium feature)
    const booking = await Booking.findOne({
      user: req.user._id,
      package: packageId,
      status: 'confirmed',
    });

    if (!booking) {
      res.status(400);
      throw new Error('You can only review packages you have booked and had confirmed');
    }

    // Check if review already exists
    const alreadyReviewed = await Review.findOne({
      package: packageId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this package');
    }

    const review = await Review.create({
      user: req.user._id,
      package: packageId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check ownership or admin role
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();

    res.status(200).json({
      message: 'Review removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
