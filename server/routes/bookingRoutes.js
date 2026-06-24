import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createBooking)
  .get(protect, authorize('admin'), getAllBookings);

router.route('/my-bookings').get(protect, getUserBookings);

router
  .route('/:id')
  .get(protect, getBookingById)
  .put(protect, authorize('admin'), updateBookingStatus)
  .delete(protect, cancelBooking);

export default router;
