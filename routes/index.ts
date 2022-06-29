import express from 'express';

import type { Request, Response } from 'express';

import webhookRouter from './webhook';

const router = express.Router();

// Hello world
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        body: 'Hello world',
    });
});

// Facebook messenger webhook
router.use('/webhook', webhookRouter)

export default router;
