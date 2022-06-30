import Message from "../models/message";
import logger from "../utils/logger";

const savePostbackMessage = async (_id: string, text: string, userId: string) => {
    return saveMessage(_id, text, userId, true);
}

const saveMessage = async (_id: string, text: string, userId: string, isPostbackMessage: boolean = false) => {
    const messageInstance = new Message({
        _id,
        text,
        userId,
        isPostbackMessage,
    });

    try {
        const messageSaved = await messageInstance.save();
        logger.info(`message ${messageSaved._id} saved`);
        return { succeed: true };
    } catch (err) {
        logger.error(`failed to save message ${_id}: ${err}`);
        return { succeed: false };
    }
}

export default { savePostbackMessage, saveMessage };