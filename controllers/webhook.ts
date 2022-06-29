import type { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
    res.status(200).json({
        body: 'Webhook get',
    });
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
    }

    // Not an event from page subscription, return 404
    res.sendStatus(404);
}

export default { get, post };
