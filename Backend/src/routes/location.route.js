import express from "express"
import locationController from "../controllers/location.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const route = express.Router()

route.post('/update', authMiddleware, locationController.updateLocation)

route.get('/nearby', locationController.getLocation)

export default route