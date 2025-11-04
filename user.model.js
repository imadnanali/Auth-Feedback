import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Please enter a valid Gmail address"]
    },
    password:{
        type: String,
        required: true,
        min: 6,
    } 
}, { timestamps: true })


const User = mongoose.model("User", userSchema);
export default User