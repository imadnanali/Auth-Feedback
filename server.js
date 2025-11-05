import express from "express"
import mongoose from "mongoose"
import {
  allFeedbacks,
  deleteFeedback,
  feedback,
  idFeedback
} from "./controller.js";
import {
  signIn,
  logIn,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyEmail
} from "./authentication.js";
import { isAuthorised } from "./authorization.js";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/feedback')
  .then(() => console.log('Connected!'));

app.use(express.json());

app.listen(8000, () => {
  console.log("app is running at port 8000")
})

app.post("/feedback", isAuthorised, feedback)
app.get("/feedback", isAuthorised, allFeedbacks)
app.get("/feedback/:id", isAuthorised, idFeedback)
app.delete("/feedback/:id", isAuthorised, deleteFeedback)


app.post("/signin", signIn)
app.post("/login", logIn)
app.get("/verify/:token", verifyEmail);
app.get("/users", getAllUsers)
app.get("/user/:id", isAuthorised, getUser)
app.put("/user/:id",isAuthorised, updateUser)
app.delete("/user/:id",isAuthorised, deleteUser)