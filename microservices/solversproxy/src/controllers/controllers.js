import axios from "axios";
import mongoose from "mongoose";
import { storeResult } from "../models/storeResult.js";
import { pushResults } from "../pushResults.js";

export async function Solver(data) {
  const dataForSolver = {
    python_script: data.pythonScript.script,
    input_data: data.inputDataFile.content,
    num_vehicles: data.extraParams.numVehicles,
    depot: data.extraParams.depot,
    max_distance: data.extraParams.maxDistance,
  };

  return axios
    .post("http://solver:5000/Solver", dataForSolver)
    .then((response) => {
      console.log("Data sent:", dataForSolver);

      const processedResult = processResult(response.data.result);
      console.log("Result received:", processedResult);

      const thisId = new mongoose.Types.ObjectId(data._id);

      const responseData = {
        id: thisId,
        userID: data.userID,
        answer: processedResult,
        execTime: response.data.execTime,
        updatedAt: data.updatedAt,
        problemID: data._id,
      };

      //storeResult(processedResult, thisId);
      console.log(responseData);
      pushResults(responseData);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function processResult(inputText) {
  const lines = inputText.split("\n");
  let objective,
    routes = [],
    maxDistance;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("Objective")) {
      objective = line.split(":")[1].trim();
    } else if (line.startsWith("Route")) {
      const route = lines[i + 1].trim();
      const distanceLine = lines[i + 2].trim();
      const distance = distanceLine.split(":")[1].trim();
      routes.push({ Route: route, Route_distance: distance });
    } else if (line.startsWith("Maximum")) {
      maxDistance = line.split(":")[1].trim();
    }
  }

  const jsonObject = {
    Objective: objective,
    Routes: routes,
    Maximum_distance: maxDistance,
  };

  return jsonObject;
}

export const checkHealth = async (req, res) => {
  try {
    return res.status(200).json({ status: "UP" });
  } catch (error) {
    return res.status(500).json({ status: "DOWN" });
  }
};
