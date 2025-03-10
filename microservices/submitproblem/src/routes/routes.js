import express from "express";
// import controllers
import {
  submitController,
  getProblemInfo,
  updateSubmission,
  runProblemController,
} from "../controllers/controllers.js";

// middleware that checks if the user who makes the request has enough permissions
import {
  isLoggedIn,
  hasUsersPermissions,
  hasPermissionsToUpdate,
} from "../controllers/askForAuthentication.js";

const router = express.Router();

// define endpoints
router.post(
  "/submitProblem/submit",
  isLoggedIn,
  hasUsersPermissions,
  submitController
);
router.get("/submitProblem/getProblemInfo/:problemId", getProblemInfo);
router.put(
  "/submitProblem/updateSubmission",
  isLoggedIn,
  hasUsersPermissions,
  hasPermissionsToUpdate,
  updateSubmission
);
router.put(
  "/runproblem",
  isLoggedIn,
  hasUsersPermissions,
  runProblemController
);

export default router;
