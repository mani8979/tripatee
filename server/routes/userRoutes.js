import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  savePackage,
  removeSavedPackage,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/saved/:packageId')
  .post(protect, savePackage)
  .delete(protect, removeSavedPackage);

export default router;
