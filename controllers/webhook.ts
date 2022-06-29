import type { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks the mode and token sent is correct
    if (mode && token && mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
}

const post = async (req: Request, res: Response) => {
    // Checks if this is an event from a page subscription
    if (req.body.object === 'page') {
        // Iterates entry
        req.body.entry.forEach(function (entry: any) {
            // Gets the message
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Not an event from page subscription, return 404
        res.sendStatus(404);
    }
}

export default { get, post };
