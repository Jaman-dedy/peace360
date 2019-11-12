import express from 'express';
import Search from '../../controllers/search';

const search = new Search();

const router = express.Router();

router.post('/', search.searchFunc);

export default router;
