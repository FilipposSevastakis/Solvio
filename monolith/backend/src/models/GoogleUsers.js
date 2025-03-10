import mongoose from "mongoose";

const Schema = mongoose.Schema;
// Define the schema for an email user (only username and email are needed)
const googleUsersSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});
// create the users model related to the previous schema
export default mongoose.model("GoogleUsers", googleUsersSchema);
