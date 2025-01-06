//2H06M 
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

import connectMongoDB from "./db/dbConnectMongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

import { protectRoute } from "./middleware/protectRoute.js";



const app = express();

app.use(express.json()); // to parse req.body

app.use(express.urlencoded({ extended: true })); // to parse form data (POSTMAN API testing etc)

app.use(cookieParser()); // to parse request cookies

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET})

app.use("/api/auth", authRoutes);
app.use("/api/user", protectRoute, userRoutes);
app.use("/api/posts", protectRoute, postRoutes);



const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectMongoDB();
});
