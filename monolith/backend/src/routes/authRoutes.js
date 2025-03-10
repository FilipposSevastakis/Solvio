import express from "express";
import { isLoggedIn, hasUsersPermissions, hasAdminsPermissions } from "../controllers/usersmanagement/askForAuthentication.js";
import { registerController, loginController, logoutController, getTokenController, updateUsernameController, getCreditsController, buyCreditsController, getUserDetailsController } from "../controllers/usersmanagement/auth.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getToken", getTokenController);
router.put("/updateUsername", isLoggedIn, updateUsernameController);
router.get("/getCredits/:userid", isLoggedIn, hasUsersPermissions, getCreditsController);
router.put("/buyCredits/:userid", isLoggedIn, hasUsersPermissions, buyCreditsController);
router.get("/getUserDetails/:userID", isLoggedIn, hasAdminsPermissions, getUserDetailsController);

export default router;
