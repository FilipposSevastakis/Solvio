import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { OAuth2Client } from "google-auth-library";
import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

// redirection after signing in via google
const redirectUrl = "http://127.0.0.1:5001/googleAuth/oauth";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirectUrl
);

// get info about an email user
async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log("data", data);
  return data;
}

// add the email user into the DB with a dummy password
// (or just update the google access token if the user is already into the DB)
const createGoogleUser = async (userData, google_access_token) => {
  try {
    console.log("GOOGLE USER DATA", userData);
    let existingUser = await Users.findOne({ email: userData.email });
    if (!existingUser) {
      console.log("USER DOES NOT EXIST", existingUser);
      let createdUser = await Users.create({
        username: userData.name,
        password: "not_a_valid_pwd",
        email: userData.email,
        google_access_token: google_access_token,
        picture: userData.picture,
      });
      return createdUser;
    } else {
      existingUser.google_access_token = google_access_token;
      await existingUser.save();
      console.log("USER EXISTS", existingUser);
      return existingUser;
    }
  } catch (error) {
    rconsole.log(error);
  }
};

const router = express.Router();

// creates the google URL that the frontend will trigger
router.post("/googleRequest", async (req, res, next) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile openid",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

// the redirect URL to which we are redirected after google authentication
// and we take user's info
router.get("/oauth", async (req, res, next) => {
  // code sent by Google
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);
    console.log("Tokens acquired", tokens);
    const data = await getUserData(tokens.access_token);
    const createdUser = await createGoogleUser(data, tokens.access_token);
    try {
      const result = await axios.post(
        "http://emailservice:5000/email/addUser",
        {
          user: createdUser,
        }
      );
      console.log("Email service - Add user", result);
      res.redirect(
        `http://localhost:8080/login?google=true&token=${tokens.access_token}`
      );
      res.status(200);
    } catch (error) {
      res.redirect(
        `http://localhost:8080/login?google=true&token=${tokens.access_token}`
      );
      res.status(200);
    }
  } catch (error) {
    console.log("Error with signing in with Google:", error.message);
    res.status(500).send("Error with signing in with Google");
  }
});

// when a google user is logged in, a JWT is created so that we are
// consistent with the usual loggin handling (i.e. when we are not using google)
router.post("/loginByGoogleToken", async (req, res, next) => {
  try {
    let googleUser = await Users.findOne({
      google_access_token: req.body.googleToken,
    });
    const token = jwt.sign({ id: googleUser._id }, process.env.JWT_KEY);

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(googleUser);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
