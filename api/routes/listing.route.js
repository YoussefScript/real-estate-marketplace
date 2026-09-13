import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  getUserListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/get", getListings);
router.get("/get/:id", getListing);
router.get("/user/:id", getUserListings);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);

export default router;
