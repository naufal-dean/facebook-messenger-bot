import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;
