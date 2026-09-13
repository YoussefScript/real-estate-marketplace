import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(401, "Invalid or expired token!"));
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You can update only your own account!"));
    }
    next();
  });
};
