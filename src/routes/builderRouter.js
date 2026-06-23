import express from "express"
import {builder, saveBuilder} from "../controllers/builderController.js"
//import { authguard } from "../services/authguard.js"

export const builderRouter = express.Router()

builderRouter.get("/", builder);
builderRouter.post("/save", saveBuilder);