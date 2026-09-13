import User from "../models/user.model.js";
import { errorHandler } from "../utils/errro.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const getTokenFromRequest = (req) => {
  const cookies = Object.fromEntries(
    (req.headers.cookie || "")
      .split("; ")
      .filter(Boolean)
      .map((cookie) => {
        const [key, ...rest] = cookie.split("=");
        return [key, decodeURIComponent(rest.join("="))];
      }),
  );

  const cookieToken = cookies.access_token;
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  return cookieToken || bearerToken || null;
};

export const test = (req, res) => {
  res.json({
    message: "test is working",
  });
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== id) {
      return next(errorHandler(403, "You can only update your own account!"));
    }

    const { username, email, password, avatar } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return next(errorHandler(400, "Username is already taken!"));
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return next(errorHandler(400, "Email is already registered!"));
      }
      user.email = email;
    }

    if (password) {
      user.password = bcryptjs.hashSync(password, 10);
    }

    if (avatar) {
      user.avatar = avatar;
    }

    const updatedUser = await user.save();
    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(errorHandler(401, "Invalid or expired token!"));
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== id) {
      return next(errorHandler(403, "You can only delete your own account!"));
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    res.clearCookie("access_token");
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(errorHandler(401, "Invalid or expired token!"));
    }
    next(error);
  }
};
