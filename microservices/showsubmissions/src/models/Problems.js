import mongoose from "mongoose";

const Schema = mongoose.Schema;

//defining the document where all problems will be saved
const problemsSchema = new Schema({
  userID: mongoose.SchemaTypes.ObjectId,
  name: String,
  model: String,
  status: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  allowToShowResults: {
    type: String,
    default: "true",
  },
});

export default mongoose.model("Problems", problemsSchema);
