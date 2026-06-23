import express from "express";
import "dotenv/config";
import session from "express-session";

import { homepageRouter } from "./routes/homepageRouter.js";
import { builderRouter } from "./routes/builderRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { dashboardRouter } from "./routes/dashboardRouter.js";
import { rosterRouter } from "./routes/rosterRouter.js";
import { inspectionRouter } from "./routes/inspectionRouter.js";
import { plannerRouter } from "./routes/plannerRouter.js";


const app = express();

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(homepageRouter);
app.use("/builder", builderRouter);
app.use(authRouter);
app.use(dashboardRouter);
app.use(rosterRouter);
app.use(inspectionRouter);
app.use("/planner", plannerRouter);

app.listen(process.env.PORT, () => {
    console.log("ecoute sur le port " + process.env.PORT);
});