import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRoutes.js";
import timelineRouter from "./router/timelineRouters.js";
import appRouter from "./router/appsRoutes.js"
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoutes.js";
import teamMemberRouter from "./router/TeamRoutes.js";
import blogPostRouter from "./router/blogRouter.js";

const app = express();

dotenv.config({path : "./config/config.env"});
console.log(process.env.PORT);
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
          process.env.PORTFOLIO_URL,
          process.env.DASHBOARD_URL
        ];
        
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
methods : ["GET", "POST", "DELETE", "PUT"],
credentials: true,

}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/timeline",timelineRouter );
app.use("/api/v1/apps", appRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/member", teamMemberRouter);
app.use("/api/v1/blogs", blogPostRouter);



app.use(errorMiddleware);
dbConnection();


export default app;