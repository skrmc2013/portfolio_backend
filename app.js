import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import prerender from 'prerender-node';

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
import commentRouter from "./router/commentRoutes.js";
import certificationRouter from "./router/certificationRouter.js";
import seoRouter from "./router/seoRoutes.js";
import cron from 'node-cron';
import generateSitemap from "./controller/sitemapController.js";
// import generateSitemap from './controllers/sitemapController.js';



const app = express();

dotenv.config({path : "./config/config.env"});
console.log(process.env.PORT);
app.use(cors({
origin : [
    // process.env.MONGO_URI,
    process.env.LOCAL_URL,
    process.env.LOCALDASHBOARD_URL,
    process.env.PORTFOLIO_URL,
    process.env.DASHBOARD_URL,
    
],
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

app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/timeline",timelineRouter );
app.use("/api/v1/apps", appRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/member", teamMemberRouter);
app.use("/api/v1/blogs", blogPostRouter);
// app.use("/api/comments", commentRouter);
app.use("/api", commentRouter);
app.use("/api/certify", certificationRouter);

app.use("/", seoRouter);  

app.use(errorMiddleware);
dbConnection();

cron.schedule('0 0 * * *', async () => {
    console.log('Generating sitemap...');
    await generateSitemap();
  });

export default app;