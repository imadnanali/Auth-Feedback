import jwt from "jsonwebtoken"
import User from "./user.model.js"
import "dotenv/config"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import crypto from "crypto";


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
        const hashPass = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(32).toString("hex");


        if (!hashPass) {
            res.status(500).json({ message: "Password not hashed" })
        }
        const user = await User.create({
            name,
            email,
            password: hashPass,
            verificationToken,
            verificationExpires: Date.now() + 5 * 60 * 1000
        })
        console.log(user)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASS
            }
        });

        const verifyUrl = `http://localhost:8000/api/verify/${verificationToken}`;

        await transporter.sendMail({
            from: `"My App" <${process.env.MY_EMAIL}>`,
            to: user.email,
            subject: "Verify your email",
            html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
        });

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ message: "User craeted successfully", token, user })
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

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first." });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            res.status(400).json({ message: "Wrong password" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        if (!token) {
            res.status(201).json({ message: "Token not generated" })
        }
        res.status(200).json({ message: "User login successfully", user, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().select("-password")
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const userUpdate = await User.findByIdAndUpdate(
            id,
            { name: name, email: email },
            { new: true }
        ).select("-password");
        res.status(200).json({ message: "Profile updated", userUpdate })
    } catch (error) {
        res.status(500).json({ message: error.messsage })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(401).json({ message: "User not deleted" })
        }
        res.status(200).json({ deletedUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
