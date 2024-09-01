import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerify: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User Name is Required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email Name is Required"],
        trim: true,
        unique: true,
    },
    password: { type: String, required: [true, "Password Name is Required"] },
    verifyCode: { type: String, required: [true, "verifyCode Name is Required"] },
    verifyCodeExpiry: { type: Date },
    isVerify: { type: Boolean, default: false },
    isAcceptingMessage: { type: Boolean, default: false },
    messages: [MessageSchema],
});

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model("User", UserSchema);

export default UserModel;
