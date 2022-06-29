import express from 'express';

import webhook from '../controllers/webhook';

const router = express.Router();

router.get('/', webhook.get);
router.post('/', webhook.post);

export default router;
