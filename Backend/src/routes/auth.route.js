import express from "express";
import authController from "../controllers/auth.controller.js";

const route = express.Router()

route.get("/user", authController.getUser)

route.post("/register", authController.registerUser)
route.post("/login", authController.loginUser)
route.post("/logout", authController.logoutUser)

export default route