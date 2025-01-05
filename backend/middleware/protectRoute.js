import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to protect the next() route
export const protectRoute = async (req, res, next) => {
  try {
 
    const token = req.cookies.jwt; //Extract the token from the req
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token Provided" });
    }


    // Decode the token and check if it is verified
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ error: "Invalid error" });
    }

    // Retrieve userId from the token. userId is added in the generateToken function. "-password to not send back to the client"

    const user = await User.findById(decoded.userId);

    if(!user){
        return res.status(400).json({error: "User not found"});
    }

    // Add user from the DB to req so it can be used on next middlewares
    req.user = user;
    next();

  } catch (error) {
    console.log("Error in the Protect Route middleware", error.message);

    res.status(500).json({ error: "Internal Server error" });

  }
};
