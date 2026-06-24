import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per package
reviewSchema.index({ package: 1, user: 1 }, { unique: true });

// Static method to get average rating and save to package
reviewSchema.statics.getAverageRating = async function (packageId) {
  const obj = await this.aggregate([
    {
      $match: { package: packageId },
    },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Package').findByIdAndUpdate(packageId, {
        ratings: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numOfReviews,
      });
    } else {
      await mongoose.model('Package').findByIdAndUpdate(packageId, {
        ratings: 0,
        numReviews: 0,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.package);
});

// Call getAverageRating after delete/remove
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.getAverageRating(this.package);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
