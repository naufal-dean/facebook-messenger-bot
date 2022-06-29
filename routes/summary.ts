import express from 'express';

import summary from '../controllers/summary';

const router = express.Router();

router.get('/', summary.get);

export default router;
