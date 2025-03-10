import Answer from "../../models/Answers.js";

export async function updateAllowResultsOnAnswer(problemID) {
    try {
        let answer = await Answer.findOne({
            _id: problemID,
        });
        answer.allowToShowResults = "false";
        await answer.save();
        return answer;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
