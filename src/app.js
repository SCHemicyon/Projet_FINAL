import express from "express"
import "dotenv/config"
import session from "express-session"
import { entrepriseRouter } from "./routes/entrepriseRouter.js"
import { employeeRouter } from "./routes/employeeRouter.js"
import { carRouter } from "./routes/carRouter.js"

const app = express()

app.use(express.static("./public"))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret : process.env.SECRET,
    resave : true,
    saveUninitialized : true
}))

app.use(entrepriseRouter)
app.use("/employees", employeeRouter)
app.use("/fleet", carRouter)


app.listen(process.env.PORT, ()=>{
    console.log("ecoute sur le port "+ process.env.PORT);
})