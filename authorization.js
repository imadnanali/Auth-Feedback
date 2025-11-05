import jwt from "jsonwebtoken";
import User from "./user.model.js";
import "dotenv/config"


export const isAuthorised = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Not authirrised" })
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ messasge: "Token not generated" })
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
        return res.status(400).json({ message: "User not found" })
    }
    const user = await User.findById(decode.userId).select("-password")
    req.user = user
    next()
}