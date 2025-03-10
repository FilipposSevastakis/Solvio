import express from "express";
import healthRoute from "./src/routes/healthRoute.js";
import routes from "./src/routes/routes.js";
import googleRoutes from "./src/routes/oauth.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { consume_from_answers_queue } from "./src/consumeAnswer.js";

// connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI);

const app = express();

// Define CORS options
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://submitproblem:5000",
    "http://showsubmissions:5000",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// use the appropriate middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", routes);
app.use("/googleAuth", googleRoutes);
app.use("/pay", paymentRoutes);
app.use("/health", healthRoute);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

// start server and start consuming from the answers' broker
// (sleep usage : ensures that RabbitMQ services are up and running when the microservice starts consuming)
app.listen(5000, async () => {
  console.log("Connected!!");
  await sleep(40000);
  consume_from_answers_queue();
});
