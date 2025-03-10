import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./src/routes/routes.js";
import authRoutes from "./src/routes/authRoutes.js"
import googleRoutes from "./src/routes/oauth.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import cookieParser from "cookie-parser";

mongoose.connect(process.env.MONGO_DB_URI);

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:3000", "http://localhost:5004"],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use("/api", routes);
app.use("/auth", authRoutes);
app.use("/googleAuth", googleRoutes);
app.use("/pay", paymentRoutes);

app.listen(5000, async () => {
});
