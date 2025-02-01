import jwt from "jsonwebtoken";
import Answer from "../models/Answers.js";
import mongoose from "mongoose";
import axios from "axios";

export const hasPermissionsToSeeResults = async (req, res, next) => {
  try {
    let id = req.query.id;
    let id_mongo = new mongoose.Types.ObjectId(id);
    const answer = await Answer.findOne({ _id: id_mongo });
    if (!answer) return res.status(404).json("Answer does not exist");
    console.log("ANSWER", answer, id_mongo);
    jwt.verify(
      req.cookies.access_token,
      process.env.JWT_KEY,
      async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        let userInfoId_mongo = new mongoose.Types.ObjectId(userInfo.id);
        console.log(
          userInfoId_mongo,
          answer.userID,
          userInfoId_mongo != answer.userID,
          userInfo.id === answer.userID,
          userInfoId_mongo.equals(answer.userID)
        );

        let response = await axios.get(
          `http://usersmanagement:5000/auth/getRole/${userInfo.id}`
        );
        console.log("GET ROLE RESPONSE", response.data);

        if (
          !userInfoId_mongo.equals(answer.userID) &&
          response.data.role === "user"
        )
          return res
            .status(403)
            .json(
              "Forbidden : You can only see the results of YOUR submissions!"
            );

        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.response.data);
  }
};
