import type { Request, Response } from 'express';

import User from '../models/user';

const get = async (req: Request, res: Response) => {
    // Fetch summary data
    const users = await User.aggregate([{
        $project: {
            user: '$_id',
            name: 1
        }
    }, {
        $unset: '_id'
    }, {
        $lookup: {
            from: 'messages',
            localField: 'user',
            foreignField: 'userId',
            as: 'messages',
            pipeline: [{
                $unset: ['userId', "__v"]
            }]
        }
    }]);
    
    res.status(200).json(users);
}

export default { get };
