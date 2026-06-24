import express from 'express';
import { submitContactForm, getInquiries, markAsRead } from '../controllers/contactController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(submitContactForm)
  .get(protect, authorize('admin'), getInquiries);

router.put('/:id/read', protect, authorize('admin'), markAsRead);

export default router;
