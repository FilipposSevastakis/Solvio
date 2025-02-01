import Answer from "../models/Answers.js";
import mongoose from "mongoose";

//the controller responsible for fetching from the database the answer of the problem specified in the query parameters of the request
export const fetchAnswers = async (req, res) => {
  let id = req.query.id;
  let id_mongo = new mongoose.Types.ObjectId(id);

  const answer = await Answer.find({ _id: id_mongo });

  if (answer[0].allowToShowResults === "true") {
    return res.status(200).json(answer);
  } else {
    return res.status(204).json("Forbidden! Not enough coins!");
  }
};

export const updateAllowResults = async (req, res) => {
  try {
    let answer = await Answer.findOne({
      _id: req.body.problemID,
    });
    answer.allowToShowResults = "false";
    await answer.save();
    return res.status(200).json(answer);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const checkHealth = async (req, res) => {
  try {
    return res.status(200).json({ status: "UP" });
  } catch (error) {
    return res.status(500).json({ status: "DOWN" });
  }
};
