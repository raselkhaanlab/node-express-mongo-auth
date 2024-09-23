import mongoose from "mongoose";
import { userStatus, UNBLOCKED, userSource, SOURCE_EMAIL } from "../config/user.js";

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true, index: true}, // unique and indexed
    password : {type: String}, // not required
    status: {type: String, enum: userStatus, default: UNBLOCKED, required: true}, // enum for status
    source : {type: String, enum: userSource, default: SOURCE_EMAIL,required: true},
    lastLogin: {type: Date, default: Date.now}, // Date type for last login
    registrationDate: {type: Date, required: true, default: Date.now} // Use Date.now without parentheses
},{collection : "users"});

const UserModel = mongoose.model('UserSchema', userSchema);

export default UserModel;