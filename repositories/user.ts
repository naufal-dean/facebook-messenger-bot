import User, { USER_STATUS, NEXT_USER_STATUS } from "../models/user";
import logger from "../utils/logger";

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
        return { user: userSaved, succeed: true };
    } catch (err) {
        logger.error(`failed to save user ${_id}: ${err}`);
        return { user: userInstance, succeed: false };
    }
}

export default { saveOrResetUser, saveOrUpdateUser };
