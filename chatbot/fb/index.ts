import logger from "../../utils/logger";

function handleMessage(senderId: string, message: object) {
    logger.info(`Handle message from ${senderId}...`);

}

function handlePostback(senderId: string, postback: object) {
    logger.info(`Handle postback from ${senderId}...`);

}

function callSendAPI(senderId: string, response: object) {
    logger.info(`Send message to ${senderId}...`);

}

export { handleMessage, handlePostback, callSendAPI };