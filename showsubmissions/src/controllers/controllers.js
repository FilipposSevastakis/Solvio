import Problems from "../models/Problems.js";
import mongoose from "mongoose";

//controller that fetches all problems that belong to a particular user (used for user's home page)
export const fetchProblems = async (req, res) => {
  let userId = req.query.userId;
  let userId_mongo = new mongoose.Types.ObjectId(userId);

  const problems = await Problems.find({ userID: userId_mongo });
  return res.status(200).json(problems);
};

//controller that fetches all problems of all users (used for admin's home page)
export const fetchProblemsAdmin = async (req, res) => {
  const problems = await Problems.find();
  return res.status(200).json(problems);
};

//controllers that deletes a specific problem whose id is in the body of the request
export const deleteProblem = async (req, res) => {
  const problems = await Problems.deleteOne({ _id: req.body.id });
  return res.status(200).json(problems);
};

export const updateAllowResults = async (req, res) => {
  try {
    let problem = await Problems.findOne({
      _id: req.body.problemID,
    });
    problem.allowToShowResults = "false";
    await problem.save();
    return res.status(200).json(problem);
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
