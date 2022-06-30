import fetch from 'node-fetch';

import logger from '../../utils/logger';
import Message from '../../models/message';
import User, { USER_STATUS, NEXT_USER_STATUS } from '../../models/user';
import { daysUntilBirthday } from '../../utils/date';

const saveOrResetUser = async (_id: string, message?: string) => {
    return saveOrUpdateUser(_id, message, true);
}

const saveOrUpdateUser = async (_id: string, message?: string, resetUser: boolean = false) => {
    let userInstance = await User.findById(_id);
    if (!userInstance) {
        // New user
        userInstance = new User({
            _id,
            status: USER_STATUS.START,
        });
    } else if (resetUser) {
        // Reset user
        userInstance.name = undefined;
        userInstance.birthDate = undefined;
        userInstance.status = USER_STATUS.START;
    } else {
        // Existing user
        userInstance.status = NEXT_USER_STATUS[userInstance.status];
        if (userInstance.status === USER_STATUS.START) {
            // Reset user
            userInstance.name = undefined;
            userInstance.birthDate = undefined;
        }
    }
    
    // Update user property
    switch (userInstance.status) {
        case USER_STATUS.NAME_ANSWERED:
            userInstance.name = message;
            break;
        case USER_STATUS.BIRTHDATE_ANSWERED:
            userInstance.birthDate = message ? new Date(message) : undefined;
            break;
    }

    try {
        const userSaved = await userInstance.save();
        logger.info(`user ${userSaved._id} saved`);
        return userSaved;
    } catch (err) {
        logger.error(`failed to save user ${_id}: ${err}`);
        return null;
    }
}

const savePostbackMessage = async (_id: string, text: string, userId: string) => {
    saveMessage(_id, text, userId, true);
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
    } catch (err) {
        logger.error(`failed to save message ${_id}: ${err}`);
    }
}

const handleMessage = async (senderId: string, message: any) => {
    logger.info(`handle message from ${senderId}`);

    // Save or update user
    const userSaved = await saveOrUpdateUser(senderId, message.text);
    if (!userSaved) {
        return;
    }

    // Save message
    await saveMessage(message.mid, message.text, senderId);

    // Make response
    let response = '';
    switch (userSaved.status) {
        case USER_STATUS.START:
            response = 'Hello there! What is your name? 😊';
            break;
        case USER_STATUS.NAME_ANSWERED:
            response = `Hi ${userSaved.name}, what is your birthday ('YYYY-MM-DD')?`;
            break;
        case USER_STATUS.BIRTHDATE_ANSWERED:
            response = 'Cool! By the way, do you want to know your birthday countdown?'
            break;
        case USER_STATUS.YES_NO_ANSWERED:
            const daysLeft = daysUntilBirthday(userSaved.birthDate);
            response = ['yes', 'yeah', 'yup'].includes(message.text)
                ? (
                    daysLeft === 0
                        ? `Wow, today is your birthday! Happy birthday to you, ${userSaved.name}!!! 🎉🎉🎉`
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
            const userSaved = await saveOrResetUser(senderId, postback.payload);
            if (!userSaved) {
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