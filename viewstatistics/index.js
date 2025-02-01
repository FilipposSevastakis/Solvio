import express from "express";
import mongoose from "mongoose";
//import { consumeProblem } from "./src/consumeProblem.js";
import { consumeResult } from "./src/consumeResult.js";
import cors from "cors";
import healthRoute from "./src/routes/healthRoute.js";
import routes from "./src/routes/routes.js";
import cookieParser from "cookie-parser";
mongoose.connect(process.env.MONGO_DB_URI);

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use("/api", routes);
app.use("/health", healthRoute);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

app.listen(5000, async () => {
  console.log("View Statistics Microservice -- Connected Successfully!");
  await sleep(40000);
  //consumeProblem();
  consumeResult();
});
