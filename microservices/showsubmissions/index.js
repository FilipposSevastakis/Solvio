import express from "express";
import healthRoute from "./src/routes/healthRoute.js";
import routes from "./src/routes/routes.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { consume_from_questions_queue } from "./src/consumeQuestion.js";
import { consume_from_answers_queue } from "./src/consumeAnswer.js";

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
  console.log("Connected!!!");
  await sleep(40000);
  consume_from_questions_queue();
  consume_from_answers_queue();
});
