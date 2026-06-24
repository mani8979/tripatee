import Blog from '../models/Blog.js';
import { uploadImage } from '../utils/cloudinary.js';

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags, readTime } = req.body;

    let coverImage = '/assets/images/blog-placeholder.jpg';
    if (req.file) {
      const url = await uploadImage(req.file);
      if (url) coverImage = url;
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      tags: parsedTags || [],
      readTime,
      image: coverImage,
      author: req.user._id,
    });

    res.status(201).json({
      message: 'Blog post created successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const { title, content, category, tags, readTime } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.readTime = readTime || blog.readTime;

    if (tags) {
      blog.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    if (req.file) {
      const url = await uploadImage(req.file);
      if (url) blog.image = url;
    }

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: 'Blog post updated successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    await blog.deleteOne();

    res.status(200).json({
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
