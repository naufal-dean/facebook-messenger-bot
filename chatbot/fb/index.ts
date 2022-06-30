import fetch from 'node-fetch';

import logger from '../../utils/logger';
import Message from '../../models/message';
import userRepository from '../../repositories/user';
import { USER_STATUS } from '../../models/user';
import { daysUntilBirthday } from '../../utils/date';

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

const handleMessage = async (senderId: string, message: any) => {
    logger.info(`handle message from ${senderId}`);

    // Save or update user
    const { user, succeed: userSaveSucceed } = await userRepository.saveOrUpdateUser(senderId, message.text);

    // Save message
    await saveMessage(message.mid, message.text, senderId);
    if (!userSaveSucceed) {
        // Failed to save user
        if (user.status === USER_STATUS.BIRTHDATE_ANSWERED) {
            // Invalid birthdate format, assuming db is working fine
            callSendTextAPI(senderId, `Please input correct birth date format ('YYYY - MM - DD')`);
        }
        return;
    }
    
    // Make response
    let response = '';
    switch (user.status) {
        case USER_STATUS.START:
            response = 'Hello there! What is your name? 😊';
            break;
        case USER_STATUS.NAME_ANSWERED:
            response = `Hi ${user.name}, what is your birth date ('YYYY-MM-DD')?`;
            break;
        case USER_STATUS.BIRTHDATE_ANSWERED:
            response = 'Cool! By the way, do you want to know your birthday countdown?'
            break;
        case USER_STATUS.YES_NO_ANSWERED:
            const daysLeft = daysUntilBirthday(user.birthDate);
            response = ['yes', 'yeah', 'yup'].includes(message.text)
                ? (
                    daysLeft === 0
                        ? `Wow, today is your birthday! Happy birthday to you, ${user.name}!!! 🎉🎉🎉`
                        : `There are ${daysLeft} days left until your next birthday`
                )
                : 'Goodbye 👋';
            break;
    }

    callSendTextAPI(senderId, response);
}

const handlePostback = async (senderId: string, postback: any) => {
    logger.info(`handle postback from ${senderId}`);

    // Supported postback(s):
    // 1. start: getting started button

    switch (postback.payload) {
        case 'start':
            // Save or reset user
            const { user, succeed: userSaveSucceed } = await userRepository.saveOrResetUser(senderId, postback.payload);
            if (!userSaveSucceed) {
                return;
            }

            // Save message
            await savePostbackMessage(postback.mid, postback.payload, senderId);

            // Make response
            callSendTextAPI(senderId, 'Hello there! What is your name? 😊');
            break;
    }
}

const callSendTextAPI = async (recipientId: string, text: string) => {
    callSendAPI(recipientId, { text });
}

const callSendAPI = async (recipientId: string, message: any) => {
    logger.info(`sent message to ${recipientId}`);
    
    const payload = {
        'recipient': {
            'id': recipientId
        },
        'message': message,
    };
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

    logger.info('message sent: ' + JSON.stringify(data));
}

export { handleMessage, handlePostback, callSendAPI };