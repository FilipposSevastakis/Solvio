import express from "express";
import healthRoute from "./src/routes/healthRoute.js";
import routes from "./src/routes/routes.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI);

const app = express();

// Define CORS options
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// use the appropriate middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/health", healthRoute);

// Start server
app.listen(5000, () => {
  console.log("Connected!!");
});
