import Problems from "../../models/Problems.js";

// get information about a problem
export const getProblemInfo = async (req, res) => {
    try {
        let problem = await Problems.find({ _id: req.params.problemId });
        if (problem.length === 0) return res.status(404).json("Problem not found!");
        return res.status(200).json({ problem });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};