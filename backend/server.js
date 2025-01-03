import express from "express";
import dotenv  from "dotenv";

import connectMongoDB from "./db/dbConnectMongoDB.js";

import authRoutes from "./routes/auth.routes.js"

const app = express();

dotenv.config();
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectMongoDB();
});


