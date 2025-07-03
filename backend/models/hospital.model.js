import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Doctor} from './doctor.model.js';

const hospitalSchema = new Schema({
    
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    }],
});

hospitalSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

hospitalSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
hospitalSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ id: this._id , email: this.email}, "hello123", { expiresIn: '2d' });//process.env.JWT_SECRET
    return token;
};
hospitalSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({ id: this._id, email: this.email }, "hello123", { expiresIn: '7d' });//process.env.JWT_SECRET
    return token;
};

const Hospital= mongoose.model('Hospital', hospitalSchema);
export default Hospital;