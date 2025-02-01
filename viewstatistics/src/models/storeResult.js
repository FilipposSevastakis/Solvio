import mongoose from "mongoose"
import Results from "./Results.js";

export async function storeResult(data) {
    try {
        const newResult = new Results({
            problemID: new mongoose.Types.ObjectId(data.problemID),
            userID: new mongoose.Types.ObjectId(data.userID),
            model: data.model,
            date: data.updatedAt,
            execTime: data.execTime
        });
        newResult.save();
        console.log(`Result ${newResult} is stored in the database`);
    } catch (error) {
        console.log(error);
    }
}