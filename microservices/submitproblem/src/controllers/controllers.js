import mongoose from "mongoose";
import Problems from "../models/Problems.js";
import { produce_to_questions_queue } from "../publishQuestion.js";

// submit a new problem and push it to the queue
export const submitController = async (req, res) => {
  try {
    let problem = await Problems.create({
      userID: req.body.userID,
      inputDataFile: req.body.inputDataFile,
      extraParams: req.body.extraParams,
      pythonScript: req.body.pythonScript,
      status: req.body.status,
      name: req.body.name,
      model: req.body.model,
    });

    produce_to_questions_queue(JSON.stringify(problem));
    return res.status(200).json({
      message: "Resource created. Problem Added successfully",
      problem: problem,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// update a submitted problem and push the updated problem to the queue
export const updateSubmission = async (req, res) => {
  try {
    let problemToUpdate = await Problems.findOne({ _id: req.body.problemId });
    if (!problemToUpdate) return res.status(404).json("Problem not found!");
    problemToUpdate.pythonScript = req.body.pythonScript;
    problemToUpdate.inputDataFile = req.body.inputDataFile;
    problemToUpdate.extraParams = req.body.extraParams;
    problemToUpdate.name = req.body.name;
    await problemToUpdate.save();
    produce_to_questions_queue(JSON.stringify(problemToUpdate));
    return res
      .status(200)
      .json({ message: "Resource updated. Problem updated successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// get information about a problem
export const getProblemInfo = async (req, res) => {
  try {
    let problem = await Problems.find({ _id: req.params.problemId });
    if (problem.length === 0) return res.status(404).json("Problem not found!");
    return res.status(200).json({ problem });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// update the status of a problem to "running" and push the problem to the queue
// (so that solversproxy forwards the problem to the solver for execution)
export const runProblemController = async (req, res) => {
  try {
    let problem = await Problems.findOne({ _id: req.body.problemID });
    problem.status = "running";
    await problem.save();
    produce_to_questions_queue(JSON.stringify(problem));
    return res.status(200).json("Problem status updated to running");
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const checkHealth = async (req, res) => {
  try {
    return res.status(200).json({ status: "UP" });
  } catch (error) {
    return res.status(500).json({ status: "DOWN" });
  }
};
