import express from 'express';
import { processPayment, getUserPayments } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/charge', protect, processPayment);
router.get('/my-payments', protect, getUserPayments);

export default router;
