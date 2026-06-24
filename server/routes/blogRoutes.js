import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router
  .route('/')
  .get(getBlogs)
  .post(protect, authorize('admin'), upload.single('image'), createBlog);

router
  .route('/:id')
  .get(getBlogById)
  .put(protect, authorize('admin'), upload.single('image'), updateBlog)
  .delete(protect, authorize('admin'), deleteBlog);

export default router;
