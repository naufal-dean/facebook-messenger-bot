import type { Request, Response } from 'express';

import { handleMessage, handlePostback } from '../chatbot/fb';
import logger from '../utils/logger';

const get = async (req: Request, res: Response) => {
    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check mode and verify token
    if (mode && token && mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        // Return challenge token
        logger.info('Webhook verified!');
        res.status(200).send(challenge);
    } else {
        // Token does not match, return 403
        res.sendStatus(403);
    }
}

const post = async (req: Request, res: Response) => {
    // Check if this is an event from a page subscription
    if (req.body.object === 'page') {
        // Iterate entry
        req.body.entry.forEach(function (entry: any) {
            const event = entry.messaging[0];
            const senderId = event.sender.id;
            // Handle message
            if (event.message) {
                handleMessage(senderId, event.message);
            } else if (event.postback) {
                handlePostback(senderId, event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Not an event from page subscription, return 404
        res.sendStatus(404);
    }
}

export default { get, post };
