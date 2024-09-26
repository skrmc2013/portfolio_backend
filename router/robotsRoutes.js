import express from 'express'
import getRobotsTxt from '../controller/robotsController';

const router = express.Router();

router.get('/robots.txt', getRobotsTxt);

module.exports = router;
