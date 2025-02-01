import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the schema of a problem
const problemsSchema = new Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  model: { type: String, required: true },
  pythonScript: {
    type: {
      script: String,
      info: String,
    },
    required: true,
  },
  inputDataFile: {
    type: {
      content: {
        Locations: [
          {
            Latitude: Number,
            Longitude: Number,
          },
        ],
      },
      info: String,
    },
    required: true,
  },
  extraParams: {
    type: {
      numVehicles: Number,
      depot: Number,
      maxDistance: Number,
    },
    required: true,
  },
  status: { type: String, required: true },
  createdAt: {
    type: Date,
    immutable: true,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
});

problemsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// create a model related to the previous schema
export default mongoose.model("Problems", problemsSchema);
