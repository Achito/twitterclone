import express from "express";
import dotenv from "dotenv";

import connectMongoDB from "./db/dbConnectMongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import { protectRoute } from "./middleware/protectRoute.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // to parse req.body

app.use(express.urlencoded({ extended: true })); // to parse form data (POSTMAN API testing etc)

app.use(cookieParser()); // to parse request cookies

dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/user", protectRoute, userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectMongoDB();
});
