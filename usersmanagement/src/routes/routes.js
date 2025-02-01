import express from "express";
// import controllers
import {
  registerController,
  loginController,
  logoutController,
  getTokenController,
  updateUsernameController,
  getCreditsController,
  buyCreditsController,
  authenticationController,
  usersPermissionsController,
  adminsPermissionsController,
  editPermissionsController,
  deletePermissionsController,
  getRoleController,
  getUserDetailsController,
} from "../controllers/auth.js";

// middleware that checks if the user who makes the request has enough permissions
import {
  hasAdminsPermissions,
  isLoggedIn,
  hasUsersPermissions,
} from "../controllers/askForAuthentication.js";

const router = express.Router();

// define the endpoints related to authentication services - and profile info/updates
// Add the necessary permissions middlewares
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getToken", getTokenController);
router.put("/updateUsername", isLoggedIn, updateUsernameController);
router.get(
  "/getCredits/:userid",
  isLoggedIn,
  hasUsersPermissions,
  getCreditsController
);
router.put(
  "/buyCredits/:userid",
  isLoggedIn,
  hasUsersPermissions,
  buyCreditsController
);

router.post("/authenticate", authenticationController);
router.post("/usersPermissions", usersPermissionsController);
router.post("/adminsPermissions", adminsPermissionsController);
router.get("/getRole/:userid", getRoleController);
router.post("/editPermissions", editPermissionsController);
router.post("/deletePermissions", deletePermissionsController);

router.get(
  "/getUserDetails/:userID",
  isLoggedIn,
  hasAdminsPermissions,
  getUserDetailsController
);

export default router;
