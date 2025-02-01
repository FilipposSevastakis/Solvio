import mongoose from "mongoose";

const Schema = mongoose.Schema;

//define the schema for the answers document in mongoDB
const answersSchema = new Schema({
  userID: mongoose.SchemaTypes.ObjectId,
  answer: {
    type: {
      Objective: Number,
      Routes: [
        {
          Route: String,
          Route_distance: String,
        },
      ],
      Maximum_distance: String,
    },
    default: null,
  },
  allowToShowResults: {
    type: String,
    default: "true",
  },
});

export default mongoose.model("Answers", answersSchema);
