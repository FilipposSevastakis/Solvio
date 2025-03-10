import express from "express";
// import controllers
import {
  addUserController,
  sendEmailForAnswerController,
} from "../controllers/controllers.js";

const router = express.Router();

// define the endpoints related to the email service
// addUser : adds email user and sends welcome message
// sendEmailForAnswer : sends emails to the users to notify them about new answers
router.post("/addUser", addUserController);
router.post("/sendEmailForAnswer", sendEmailForAnswerController);

export default router;
