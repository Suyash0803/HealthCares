import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const medicalRecordSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    recordType: {
        type: String,
        enum: ['prescription', 'report', 'bill'],
        required: true
    },
    ipfsHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    authorizedUsers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType'
        },
        userType: {
            type: String,
            enum: ['Patient', 'Doctor']
        },
        accessGrantedAt: {
            type: Date,
            default: Date.now
        },
        accessExpiresAt: {
            type: Date
        }
    }]
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord; 