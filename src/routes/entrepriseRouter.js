import express from "express"
import {updateEntreprise, deleteEntreprise, getRegister, postRegister, getLogin, postLogin, getHome, getLogout, getEmployees, getFleet, getSettings} from "../controllers/entrepriseController.js"
import { authguard } from "../services/authguard.js"

export const entrepriseRouter = express.Router()

entrepriseRouter.get("/register", getRegister)
entrepriseRouter.post("/register", postRegister)

entrepriseRouter.get("/login", getLogin)
entrepriseRouter.post("/login", postLogin)

entrepriseRouter.get("/home", authguard, getHome)
entrepriseRouter.get("/employe", authguard, getEmployees)
entrepriseRouter.get("/fleet", authguard, getFleet)
entrepriseRouter.get("/settings", authguard, getSettings)
entrepriseRouter.get("/logout", authguard, getLogout)

entrepriseRouter.post("/update", authguard, updateEntreprise)
entrepriseRouter.post("/unregister", authguard, deleteEntreprise)
