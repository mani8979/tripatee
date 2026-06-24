import express from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getDestinations,
  createDestination,
} from '../controllers/packageController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Destinations routes (placed before dynamic :id route to avoid routing clashes)
router
  .route('/destinations')
  .get(getDestinations)
  .post(protect, authorize('admin'), createDestination);

// Packages routes
router
  .route('/')
  .get(getPackages)
  .post(protect, authorize('admin'), upload.array('gallery', 10), createPackage);

router
  .route('/:id')
  .get(getPackageById)
  .put(protect, authorize('admin'), upload.array('gallery', 10), updatePackage)
  .delete(protect, authorize('admin'), deletePackage);

export default router;
