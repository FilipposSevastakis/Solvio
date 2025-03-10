import mongoose from "mongoose"

const Answers_Schema = new mongoose.Schema({
    userID: mongoose.SchemaTypes.ObjectId,
    answer: {
        type: {
            Objective: Number,
            Routes: [
                {
                    Route: String,
                    Route_distance: String
                }
            ],
            Maximum_distance: String
        },
        default: null
    },
    execTime: { type: Number, default: null },
    date: { type: Date },
    allowToShowResults: {
        type: String,
        default: "true",
    },
})

export default mongoose.model("Answers", Answers_Schema)