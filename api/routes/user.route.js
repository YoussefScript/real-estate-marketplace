import express from "express";
import {
  deleteUser,
  test,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
