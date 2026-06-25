import mongoose from 'mongoose';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import { uploadImage } from '../utils/cloudinary.js';

// @desc    Get all packages with filtering and search
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req, res, next) => {
  try {
    const {
      search,
      destination,
      minPrice,
      maxPrice,
      duration,
      featured,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Search query matches title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by destination ID or Destination Name
    if (destination) {
      if (mongoose.Types.ObjectId.isValid(destination)) {
        query.destination = destination;
      } else {
        const foundDest = await Destination.findOne({
          name: { $regex: new RegExp(`^${destination}$`, 'i') }
        });
        if (foundDest) {
          query.destination = foundDest._id;
        } else {
          // If no destination is found, set to an impossible ID to return an empty list
          query.destination = new mongoose.Types.ObjectId();
        }
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by duration search
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }

    // Filter featured packages
    if (featured === 'true') {
      query.featured = true;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build query builder
    let queryBuilder = Package.find(query).populate('destination');

    // Sorting options
    if (sort) {
      if (sort === 'priceAsc') {
        queryBuilder = queryBuilder.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        queryBuilder = queryBuilder.sort({ price: -1 });
      } else if (sort === 'ratingDesc') {
        queryBuilder = queryBuilder.sort({ ratings: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      }
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const totalPackages = await Package.countDocuments(query);
    const packages = await queryBuilder.skip(skip).limit(Number(limit));

    res.status(200).json({
      packages,
      page: Number(page),
      pages: Math.ceil(totalPackages / Number(limit)),
      totalPackages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package details with populated reviews
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = async (req, res, next) => {
  try {
    const tourPackage = await Package.findById(req.params.id).populate('destination');

    if (!tourPackage) {
      res.status(404);
      throw new Error('Tour package not found');
    }

    // Retrieve reviews for this package
    const reviews = await Review.find({ package: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      package: tourPackage,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a tour package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req, res, next) => {
  try {
    const {
      title,
      destination,
      description,
      price,
      duration,
      itinerary, // Expecting JSON string or array
      inclusions,
      exclusions,
      maxGroupSize,
      availableDates,
      featured,
    } = req.body;

    // Check if destination exists
    const dest = await Destination.findById(destination);
    if (!dest) {
      res.status(404);
      throw new Error('Associated destination not found');
    }

    // Parse itinerary if sent as a string from form-data
    let parsedItinerary = itinerary;
    if (typeof itinerary === 'string') {
      parsedItinerary = JSON.parse(itinerary);
    }

    let parsedInclusions = inclusions;
    if (typeof inclusions === 'string') {
      parsedInclusions = JSON.parse(inclusions);
    }

    let parsedExclusions = exclusions;
    if (typeof exclusions === 'string') {
      parsedExclusions = JSON.parse(exclusions);
    }

    let parsedDates = availableDates;
    if (typeof availableDates === 'string') {
      parsedDates = JSON.parse(availableDates);
    }

    // Handle uploaded image files
    const galleryUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file);
        if (url) galleryUrls.push(url);
      }
    }

    const newPackage = await Package.create({
      title,
      destination,
      description,
      price: Number(price),
      duration,
      itinerary: parsedItinerary,
      inclusions: parsedInclusions,
      exclusions: parsedExclusions,
      maxGroupSize: Number(maxGroupSize),
      availableDates: parsedDates || [new Date()],
      featured: featured === 'true' || featured === true,
      gallery: galleryUrls.length > 0 ? galleryUrls : ['/assets/images/tour-placeholder.jpg'],
    });

    res.status(201).json({
      message: 'Tour package created successfully',
      package: newPackage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a tour package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res, next) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (!tourPackage) {
      res.status(404);
      throw new Error('Tour package not found');
    }

    const {
      title,
      destination,
      description,
      price,
      duration,
      itinerary,
      inclusions,
      exclusions,
      maxGroupSize,
      availableDates,
      featured,
    } = req.body;

    if (destination) {
      const dest = await Destination.findById(destination);
      if (!dest) {
        res.status(404);
        throw new Error('Associated destination not found');
      }
      tourPackage.destination = destination;
    }

    tourPackage.title = title || tourPackage.title;
    tourPackage.description = description || tourPackage.description;
    tourPackage.price = price !== undefined ? Number(price) : tourPackage.price;
    tourPackage.duration = duration || tourPackage.duration;
    tourPackage.maxGroupSize = maxGroupSize !== undefined ? Number(maxGroupSize) : tourPackage.maxGroupSize;
    tourPackage.featured = featured !== undefined ? (featured === 'true' || featured === true) : tourPackage.featured;

    if (itinerary) {
      tourPackage.itinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    }
    if (inclusions) {
      tourPackage.inclusions = typeof inclusions === 'string' ? JSON.parse(inclusions) : inclusions;
    }
    if (exclusions) {
      tourPackage.exclusions = typeof exclusions === 'string' ? JSON.parse(exclusions) : exclusions;
    }
    if (availableDates) {
      tourPackage.availableDates = typeof availableDates === 'string' ? JSON.parse(availableDates) : availableDates;
    }

    // Manage file uploads
    if (req.files && req.files.length > 0) {
      const galleryUrls = [];
      for (const file of req.files) {
        const url = await uploadImage(file);
        if (url) galleryUrls.push(url);
      }
      if (galleryUrls.length > 0) {
        tourPackage.gallery = galleryUrls; // Overwrite or extend gallery
      }
    }

    const updatedPackage = await tourPackage.save();

    res.status(200).json({
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a tour package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res, next) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (!tourPackage) {
      res.status(404);
      throw new Error('Tour package not found');
    }

    await tourPackage.deleteOne();

    res.status(200).json({
      message: 'Package deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all destinations
// @route   GET /api/packages/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({});
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a destination
// @route   POST /api/packages/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    const { name, country, description, image, bannerImage } = req.body;

    const destExists = await Destination.findOne({ name });
    if (destExists) {
      res.status(400);
      throw new Error('Destination name already exists');
    }

    // Default fallbacks if images aren't uploaded
    const dest = await Destination.create({
      name,
      country,
      description,
      image: image || '/assets/images/destination-placeholder.jpg',
      bannerImage: bannerImage || '/assets/images/destination-banner-placeholder.jpg',
    });

    res.status(201).json({
      message: 'Destination created successfully',
      destination: dest,
    });
  } catch (error) {
    next(error);
  }
};
