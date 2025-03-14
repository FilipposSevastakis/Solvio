import mongoose from "mongoose"

const Problems_Schema = new mongoose.Schema({
    userID: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: String, required: true },
    model: { type: String, required: true },
    pythonScript: {
        type: {
            script: { type: String, required: true },
            info: String
        },
        required: true
    },
    inputDataFile: {
        type: {
            content: {
                type: {
                    Locations: [
                        {
                            Latitude: Number,
                            Longitude: Number
                        }
                    ]
                },
                required: true
            },
            info: String
        },
        required: true
    },
    extraParams: {
        type: {
            numVehicles: { type: Number, required: true },
            depot: { type: Number, required: true },
            maxDistance: { type: Number, required: true }
        },
        required: true
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
    allowToShowResults: {
        type: String,
        default: "true",
    },
})

export default mongoose.model("Problems", Problems_Schema)