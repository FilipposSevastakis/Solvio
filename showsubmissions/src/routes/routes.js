import express from "express";
import {
  fetchProblems,
  deleteProblem,
  fetchProblemsAdmin,
  updateAllowResults,
} from "../controllers/controllers.js";
// middleware that checks if the user who makes the request is logged in
import {
  hasAdminsPermissions,
  isLoggedIn,
  hasUsersPermissions,
  hasPermissionsToDelete,
} from "../controllers/askForAuthentication.js";

const router = express.Router();

router.get("/showSubmissions", isLoggedIn, fetchProblems);
router.post(
  "/deleteProblem",
  isLoggedIn,
  hasPermissionsToDelete,
  deleteProblem
);
router.get("/admin/showSubmissions", isLoggedIn, fetchProblemsAdmin);

router.post("/updateAllowResults", updateAllowResults);

export default router;
