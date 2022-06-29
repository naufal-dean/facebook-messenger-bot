import type { Request, Response } from 'express';
import Message from '../models/message';

const get = async (req: Request, res: Response) => {
    // Retrieve all messages
    try {
        const messages = await Message.find().select('-__v');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({
            message: 'database error'
        });
    }
}

const getById = async (req: Request, res: Response) => {    
    // Parse path params
    const messageId = req.params.id;

    // Retrieve message with messageId
    try {
        const message = await Message.findById(messageId).select('-__v');
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({
            message: 'database error'
        });
    }
}

export default { get, getById };
