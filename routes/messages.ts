import express from 'express';

import messages from '../controllers/messages';

const router = express.Router();

router.get('/', messages.get);
router.get('/:id', messages.getById);

export default router;
