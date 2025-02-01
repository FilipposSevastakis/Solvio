import express from "express";
import {
  fetchAnswers,
  updateAllowResults,
} from "../controllers/controllers.js";
import { hasPermissionsToSeeResults } from "../controllers/checkPermissions.js";

const router = express.Router();

router.get("/getResults", hasPermissionsToSeeResults, fetchAnswers);

router.post("/updateAllowResults", updateAllowResults);

export default router;
