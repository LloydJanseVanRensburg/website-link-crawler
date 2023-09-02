import { Router } from 'express';
import {getDownloadFileById, getHomePage, postScrapeWebsite} from "../controllers/index.js";

const router = Router();

router.get('/', getHomePage);

router.post('/scrape-website', postScrapeWebsite);

router.get('/download/:filename', getDownloadFileById)

export default router;
