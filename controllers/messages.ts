import type { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
    // TODO: implement
    res.sendStatus(501);
}

const getById = async (req: Request, res: Response) => {    
    // Parse path params
    const messageId = req.params.id;

    // TODO: implement
    res.sendStatus(501);
}

export default { get, getById };
