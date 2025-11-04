import Feedback from "./feedback.model.js";

export const feedback = async (req, res) => {
    try {
        const { message, rating, user } = req.body;
        console.log(req.body)
        if (!message || !rating || !user) {
            return res.status(500).json({ message: "All fields required" })
        }
        const feedback = await Feedback.create({ message, rating, user})
        console.log(feedback)
        return res.status(200).json({ message: "Feedback saved" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const allFeedbacks = async (req, res) => {
    try {
        const allfeedbacks = await Feedback.find({});
        console.log(allfeedbacks);
        return res.status(200).json(allFeedbacks);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const idFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);
        console.log(feedback)
        return res.status(200).json(feedback)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }

}


export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFeedback = await Feedback.findByIdAndDelete(id)
        console.log(deletedFeedback)
        res.status(200).json({ message: "Feedback deleted successfully!" })
    } catch (error) {
        res.status(404).json({message: error.message})
    }

}