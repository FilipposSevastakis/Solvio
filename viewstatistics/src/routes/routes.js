import express from "express";
import {
  hasAdminsPermissions,
  isLoggedIn,
} from "../controllers/askForAuthentication.js";
import { getStats } from "../controllers/controllers.js";

const router = express.Router();

router.get("/admin/viewStatistics", isLoggedIn, hasAdminsPermissions, getStats);

export default router;
