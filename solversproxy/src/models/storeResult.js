import Problems from "./Problems.js";

export async function storeResult(data, id) {
    try {
        await Problems.findByIdAndUpdate(id, { answer: {
            Objective: data.Objective,
            Routes: data.Routes,
            MaximumDistance: data.Maximum_distance } });

        const updatedProblem = await Problems.findById(id);

        const response = {
            id: updatedProblem._id,
            userID: updatedProblem.userID,
            answer: updatedProblem.answer
        };

        return response;
    } catch (error) {
        // Handle errors
        console.error("Error updating problem (answer):", error);
        throw error;
    }
}