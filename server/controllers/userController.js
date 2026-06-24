import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedTrips',
      populate: { path: 'destination' },
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedTrips: user.savedTrips,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;

      if (req.body.email) {
        // Check if email already taken
        if (req.body.email !== user.email) {
          const emailExists = await User.findOne({ email: req.body.email });
          if (emailExists) {
            res.status(400);
            throw new Error('Email is already in use');
          }
          user.email = req.body.email;
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        message: 'Profile updated successfully',
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Save/bookmark package
// @route   POST /api/users/saved/:packageId
// @access  Private
export const savePackage = async (req, res, next) => {
  const { packageId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.savedTrips.includes(packageId)) {
      return res.status(200).json({
        message: 'Package already saved',
        savedTrips: user.savedTrips,
      });
    }

    user.savedTrips.push(packageId);
    await user.save();

    res.status(200).json({
      message: 'Package added to saved trips',
      savedTrips: user.savedTrips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved package
// @route   DELETE /api/users/saved/:packageId
// @access  Private
export const removeSavedPackage = async (req, res, next) => {
  const { packageId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.savedTrips = user.savedTrips.filter((id) => id.toString() !== packageId);
    await user.save();

    res.status(200).json({
      message: 'Package removed from saved trips',
      savedTrips: user.savedTrips,
    });
  } catch (error) {
    next(error);
  }
};
