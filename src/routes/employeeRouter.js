import express from "express"
import {addEmployee, deleteEmployee, editEmployee} from "../controllers/employeeController.js"
import { authguard } from "../services/authguard.js"

export const employeeRouter = express.Router()

employeeRouter.post("/add",authguard, addEmployee)
employeeRouter.post("/delete/:id",authguard, deleteEmployee)
employeeRouter.post("/edit/:id",authguard, editEmployee)