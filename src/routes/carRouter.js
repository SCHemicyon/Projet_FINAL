import express from "express"
import {addCar, deleteCar, editCar} from "../controllers/carController.js"
import { authguard } from "../services/authguard.js"

export const carRouter = express.Router()

carRouter.post("/add",authguard, addCar)
carRouter.post("/delete/:id",authguard, deleteCar)
carRouter.post("/edit/:id",authguard, editCar)