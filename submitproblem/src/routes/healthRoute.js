import express from "express";
// import controllers
import { checkHealth } from "../controllers/controllers.js";

const router = express.Router();

// healthcheck endpoint
router.post("/submitproblem/check", checkHealth);

export default router;
