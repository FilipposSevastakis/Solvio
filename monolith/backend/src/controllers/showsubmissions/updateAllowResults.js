import Problems from "../../models/Problems.js";

export async function updateAllowResultsOnProblem(problemID) {
    try {
        let problem = await Problems.findOne({
            _id: problemID,
        });
        problem.allowToShowResults = "false";
        await problem.save();
        return problem;
    } catch (error) {
        console.log(error);
        throw error;
    }
};