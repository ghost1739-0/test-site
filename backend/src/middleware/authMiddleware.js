import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized, user not found."));
    }

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Not authorized, token invalid."));
  }
}

export function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  res.status(403);
  return next(new Error("Admin access required."));
}
