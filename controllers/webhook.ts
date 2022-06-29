import type { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
    res.status(200).json({
        body: 'Webhook get',
    });
}

const post = async (req: Request, res: Response) => {
    res.status(200).json({
        body: 'Webhook post',
    });
}

export default { get, post };
