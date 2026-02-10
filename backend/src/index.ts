import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import "./config/passport.config"
import passport from "passport";
import authRoutes from "./routes/auth.routes";
import { rollingSession } from "./middlewares/rollingSession.middleware";
import userRoutes from "./routes/user.routes";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.routes";
import memberRoutes from "./routes/member.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
const BASE_PATH = config.BASE_PATH;

//Initial configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3days
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(rollingSession);
app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);

//Routes
app.get(`/`,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        res.status(HTTPSTATUS.OK)
            .json({ message: `Server is running on port ${config.PORT}` });
    }));

app.use(`${BASE_PATH}/auth`, authRoutes)
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes)
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes)
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

//Error Handling Middleware
app.use(errorHandler);

const Server = app.listen(config.PORT || 5000, async () => {
    console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    await connectDatabase();
})

//Server starts
Server.on("error", (error) => {
    console.log("Server Connect ERROR: ", error);
})

