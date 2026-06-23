import { Router } from "express";

import {
    rosterPage,
    addPlayer,
    removePlayer
} from "../controllers/rosterController.js";

export const rosterRouter = Router();

rosterRouter.get("/roster", rosterPage);
rosterRouter.post("/roster/add", addPlayer);
rosterRouter.post("/roster/remove", removePlayer);