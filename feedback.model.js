import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})


const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;