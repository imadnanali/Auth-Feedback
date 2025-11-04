import jwt from "jsonwebtoken"
import User from "./user.model.js"
import "dotenv/config"
import bcrypt from "bcrypt"

export const signIn = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Fill all required field" });
        }
        const accountAlreadyExist = await User.findOne({ email });
        if (accountAlreadyExist) {
            return res.status(400).json({ message: "Account already exist with this email!" })
        }
        const hashPass = await bcrypt.hash(password, 10);
        if (!hashPass) {
            res.status(500).json({ message: "Password not hashed" })
        }
        const user = await User.create({ name, email, password: hashPass })
        console.log(user)

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ message: "User craeted successfully", token, user})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Fill all field" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Account doesn't exist with this email!" })
        }
        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            res.status(400).json({ message: "Wrong password" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {expiresIn: '1d'})
        if (!token) {
            res.status(201).json({ message: "Token not generated" })
        }
        res.status(200).json({ message: "User login successfully", user, token })
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}