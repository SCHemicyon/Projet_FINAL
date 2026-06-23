import express from "express"
import {getHomepage} from "../controllers/homepageController.js"
//import { authguard } from "../services/authguard.js"

export const homepageRouter = express.Router()

homepageRouter.get("/", getHomepage)