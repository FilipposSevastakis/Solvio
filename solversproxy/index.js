import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import healthRoute from "./src/routes/healthRoute.js";
import { consumeProblem } from "./src/consumeProblem.js";

mongoose.connect(process.env.MONGO_DB_URI);

const app = express();

// Define CORS options
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5004",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// use the appropriate middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/health", healthRoute);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

app.listen(5000, async () => {
  console.log("Connected!");
  await sleep(40000);
  consumeProblem();
});
