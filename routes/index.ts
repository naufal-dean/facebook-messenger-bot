import express from 'express';

import type { Request, Response } from 'express';

import webhookRouter from './webhook';
import messagesRouter from './messages';
import summaryRouter from './summary';

const router = express.Router();

// Hello world
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        body: 'Hello world',
    });
});

// Facebook messenger webhook
router.use('/webhook', webhookRouter);

// REST API endpoint
router.use('/messages', messagesRouter);
router.use('/summary', summaryRouter);

export default router;
