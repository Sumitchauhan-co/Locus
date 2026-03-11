import express from "express"
import contactController from "../controllers/contact.controller.js"

const route = express.Router()

route.post("/create", contactController.getContactData)

export default route