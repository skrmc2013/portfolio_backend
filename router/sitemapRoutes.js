import express from 'express';
import generateSitemap from '../controller/sitemapController';
// const { generateSitemap } = require('../controllers/sitemapController');

const router = express.Router();

router.get('/sitemap.xml', generateSitemap);

export default router
