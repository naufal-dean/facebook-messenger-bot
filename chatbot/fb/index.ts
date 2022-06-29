import fetch from 'node-fetch';

import logger from '../../utils/logger';

const handleMessage = async (senderId: string, message: any) => {
    logger.info(`Handle message from ${senderId}...`);
    callSendAPI(senderId, {
        text: 'echo: ' + message.text
    });
}

const handlePostback = async (senderId: string, postback: any) => {
    logger.info(`Handle postback from ${senderId}...`);

}

const callSendAPI = async (recipientId: string, message: any) => {
    logger.info(`Send message to ${recipientId}...`);
    
    const payload = {
        'recipient': {
            'id': recipientId
        },
        'message': message,
    };
    logger.info(JSON.stringify(payload))
    const response = await fetch('https://graph.facebook.com/v2.6/me/messages?' + new URLSearchParams({
        access_token: process.env.PAGE_ACCESS_TOKEN || '',
    }), {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    logger.info(JSON.stringify(data));
}

export { handleMessage, handlePostback, callSendAPI };