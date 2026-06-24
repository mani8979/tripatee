import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Blog from '../models/Blog.js';

// @desc    Get dashboard metrics and analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Count stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPackages = await Package.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const totalBlogs = await Blog.countDocuments({});

    // Calculate total revenue
    const revenueObj = await Booking.aggregate([
      {
        $match: { paymentStatus: 'paid' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = revenueObj.length > 0 ? revenueObj[0].totalRevenue : 0;

    // Get recent bookings
    const recentBookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('package', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get distribution of bookings by status
    const statusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate user list for admin display
    const userList = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      metrics: {
        totalUsers,
        totalPackages,
        totalBookings,
        totalBlogs,
        totalRevenue,
      },
      recentBookings,
      statusDistribution,
      users: userList,
    });
  } catch (error) {
    next(error);
  }
};
