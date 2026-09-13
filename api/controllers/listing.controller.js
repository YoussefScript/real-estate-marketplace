import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

const normalizeListingInput = (body, userId) => {
  const { beds, baths, address, images, imageUrls, ...rest } = body;

  return {
    ...rest,
    address: address || body.address || "",
    bedrooms: Number(beds ?? rest.bedrooms ?? 1),
    bathrooms: Number(baths ?? rest.bathrooms ?? 1),
    imageUrls: imageUrls || images || [],
    contactInfo:
      typeof body.contactInfo === "string" ? body.contactInfo.trim() : "",
    userRef: userId,
  };
};

export const createListing = async (req, res, next) => {
  try {
    const listingData = normalizeListingInput(req.body, req.user.id);

    if (!listingData.name || !listingData.description || !listingData.address) {
      return next(
        errorHandler(400, "Please fill in all required listing fields."),
      );
    }

    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const { offer, type, searchTerm, sort, limit } = req.query;
    const query = {};

    if (offer) {
      query.offer = offer === "true";
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ];
    }

    let listingsQuery = Listing.find(query).sort({ createdAt: -1 });

    if (limit) {
      const limitNumber = Number(limit);
      if (!Number.isNaN(limitNumber)) {
        listingsQuery = listingsQuery.limit(limitNumber);
      }
    }

    let listings = await listingsQuery;

    if (sort === "price_asc") {
      listings = [...listings].sort((a, b) => a.regularPrice - b.regularPrice);
    }

    if (sort === "price_desc") {
      listings = [...listings].sort((a, b) => b.regularPrice - a.regularPrice);
    }

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(403, "You can delete only your own listings!"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(403, "You can update only your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: normalizeListingInput(req.body, req.user.id) },
      { new: true },
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
