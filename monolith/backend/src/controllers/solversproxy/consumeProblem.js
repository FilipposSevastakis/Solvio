import axios from "axios";
import Problems from "../../models/Problems.js";
import { storeAnswer } from "../../models/storeAnswer.js";
import { sendEmailForAnswer } from "../emailservice/sendEmailForAnswer.js";
import { creditsOfAnswer } from "../usersmanagement/creditsOfAnswer.js";

export const problemsQueue = [];
export let solverStatus = true;

export function consumeProblem(problemID) {
    problemsQueue.push(problemID);
    console.log("Problem queued: ", problemID);

    if (solverStatus) Solver();
}

const Solver = async (req, res) => {
    if (problemsQueue.length === 0) return;

    solverStatus = false;
    const thisID = await problemsQueue.shift();
    console.log("Problem taken from queue: ", thisID);
    try {
        const problem = await Problems.findById(thisID);

        if (!problem) {
            console.log(`Problem with ID ${thisID} not found`);
            solverStatus = true;
            return;
        }

        const dataForSolver = {
            python_script: problem.pythonScript.script,
            input_data: problem.inputDataFile.content,
            num_vehicles: problem.extraParams.numVehicles,
            depot: problem.extraParams.depot,
            max_distance: problem.extraParams.maxDistance,
        };

        res = await axios.post("http://solver:5000/Solver", dataForSolver);

        await storeAnswer(res.data, thisID, problem.userID, problem.updatedAt);

        // For showsubmissions
        const toBeUpdated = await Problems.findById(thisID);
        if (toBeUpdated) {
            toBeUpdated.status = 'finished';
            await toBeUpdated.save();
        }

        sendEmailForAnswer(problem.userID, thisID);
        creditsOfAnswer(problem.userID, res.data);

        solverStatus = true;
        Solver();
    }
    catch (error) {
        console.log(error);
    }
}