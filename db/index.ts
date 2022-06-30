import mongoose from 'mongoose';

import logger from '../utils/logger';

const initDbConn = async (mongodbUri?: string) => {
    if (!mongodbUri) {
        logger.error('MONGODB_URI is not defined');
        process.exit(1);
    }

    mongoose.connect(mongodbUri).then(res => {
        logger.info('database connection established');
    }).catch(err => {
        logger.error('failed to establish database connection');
        process.exit(1);
    });
}

export default initDbConn;
