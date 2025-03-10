import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the schema for a user
const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    default: 100,
  },
  totalExecTime: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    default: "",
  },
  google_access_token: { type: String, default: "" },
  picture: {
    type: String,
    default:
      "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
  },
  joinedAt: {
    type: Date,
    immutable: true,
    required: true,
    default: () => Date.now(),
  },
});

// create the users model related to the previous schema
export default mongoose.model("Users", usersSchema);
