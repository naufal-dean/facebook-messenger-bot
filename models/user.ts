import mongoose from "mongoose";

const USER_STATUS = {
    START: 'START',                             // User initiated conversation 
    NAME_ANSWERED: 'NAME_ANSWERED',             // User answered first name
    BIRTHDATE_ANSWERED: 'BIRTHDATE_ANSWERED',   // User answered birth date
    YES_NO_ANSWERED: 'YES_NO_ANSWERED',         // User answered last question
};

const NEXT_USER_STATUS = {
    [USER_STATUS.START]: USER_STATUS.NAME_ANSWERED,
    [USER_STATUS.NAME_ANSWERED]: USER_STATUS.BIRTHDATE_ANSWERED,
    [USER_STATUS.BIRTHDATE_ANSWERED]: USER_STATUS.YES_NO_ANSWERED,
    [USER_STATUS.YES_NO_ANSWERED]: USER_STATUS.START,
};

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', UserSchema);

export default User;
export { USER_STATUS, NEXT_USER_STATUS };
