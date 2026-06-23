import express from "express";
import { planner, savePlanner } from "../controllers/plannerController.js";

export const plannerRouter = express.Router();

plannerRouter.get("/", planner);
plannerRouter.post("/save", savePlanner);
