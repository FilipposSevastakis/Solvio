import mongoose from "mongoose"
import Problems from "./Problems.js";

export async function storeProblem(data) {
    try {
        const newProblem = new Problems({
            _id: new mongoose.Types.ObjectId(data._id),
            userID: new mongoose.Types.ObjectId(data.userID),
            name: data.name,
            model: data.model,
            pythonScript: {
                script: data.pythonScript.script,
                info: data.pythonScript.info
            },
            inputDataFile: {
                content:{
                    Locations: [
                        {
                            Latitude: data.inputDataFile.content.Locations.Latitude,
                            Longitude: data.inputDataFile.content.Locations.Longitude,
                        }
                    ]
                },
                info: data.inputDataFile.info
            },
            extraParams: {
                numVehicles: data.extraParams.numVehicles,
                depot: data.extraParams.depot,
                maxDistance: data.extraParams.maxDistance
            },
            date : data.updatedAt
        });
        newProblem.save();
        console.log(`Problem (id: ${newProblem.id}) is stored in the database`);
    } catch (error) {
        console.log(error);
    }
}