import express from "express";
// import controllers
import { checkHealth } from "../controllers/health.js";

const router = express.Router();

// healthcheck endpoint
router.post("/usersmanagement/check", checkHealth);

export default router;
