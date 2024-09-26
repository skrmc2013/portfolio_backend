// router/seoRoutes.js

import express from "express";
import generateSitemap from "../controller/sitemapController.js";
import getRobotsTxt from "../controller/robotsController.js";

const router = express.Router();

// Route for sitemap.xml
router.get('/sitemap.xml', generateSitemap);

// Route for robots.txt
router.get('/robots.txt', getRobotsTxt);

export default router;
