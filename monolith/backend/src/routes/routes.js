import express from "express";
import { getStats } from "../controllers/viewstatistics/processStatistics.js";
import { fetchAnswers } from "../controllers/showresults/fetchAnswers.js";
import { getProblemInfo } from "../controllers/submitproblem/getProblem.js";
import { submitController } from "../controllers/submitproblem/submitProblem.js";
import { updateSubmission } from "../controllers/submitproblem/updateProblem.js";
import { runProblemController } from "../controllers/submitproblem/runProblem.js";
import { fetchProblems, fetchProblemsAdmin, deleteProblem } from "../controllers/showsubmissions/fetchProblems.js";
/* usermanagement's controllers */
import { hasPermissionsToSeeResults, isLoggedIn, hasUsersPermissions, hasAdminsPermissions, hasPermissionsToDelete, hasPermissionsToUpdate } from "../controllers/usersmanagement/askForAuthentication.js";

const router = express.Router();

/* showresults route */
router.get("/getResults", hasPermissionsToSeeResults, fetchAnswers);

/* viewstatistics route */
router.get("/admin/viewStatistics", isLoggedIn, hasAdminsPermissions, getStats);

/* submitproblem routes */
router.post("/submitProblem/submit", isLoggedIn, hasUsersPermissions, submitController);
router.get("/submitProblem/getProblemInfo/:problemId", getProblemInfo);
router.put("/submitProblem/updateSubmission", isLoggedIn, hasUsersPermissions, hasPermissionsToUpdate, updateSubmission);
router.put("/runproblem", isLoggedIn, hasUsersPermissions, runProblemController);

/* showsubmissions' routes */
router.get("/showSubmissions", isLoggedIn, fetchProblems);
router.post("/deleteProblem", isLoggedIn, hasPermissionsToDelete, deleteProblem);
router.get("/admin/showSubmissions", isLoggedIn, fetchProblemsAdmin);

export default router;
