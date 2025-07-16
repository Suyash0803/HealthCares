import MedicalRecord from '../models/medicalRecord.model.js';
import { create } from 'ipfs-http-client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Initialize IPFS client
const ipfs = create({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
});

// Upload medical record to IPFS and save metadata to MongoDB
const uploadMedicalRecord = asyncHandler(async (req, res) => {
    const { recordType, name, description } = req.body;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "File is required");
    }

    // Upload to IPFS
    const fileBuffer = await file.buffer;
    const result = await ipfs.add(fileBuffer);
    const ipfsHash = result.path;

    // Create medical record in database
    const medicalRecord = await MedicalRecord.create({
        patientId: req.user._id,
        recordType,
        ipfsHash,
        name,
        description,
        authorizedUsers: [{
            userId: req.user._id,
            userType: 'Patient'
        }]
    });

    return res.status(201).json(
        new ApiResponse(201, medicalRecord, "Medical record uploaded successfully")
    );
});

// Get all medical records for a patient
const getPatientRecords = asyncHandler(async (req, res) => {
    const records = await MedicalRecord.find({
        $or: [
            { patientId: req.user._id },
            { 'authorizedUsers.userId': req.user._id }
        ]
    });

    return res.status(200).json(
        new ApiResponse(200, records, "Records fetched successfully")
    );
});

// Grant access to a user
const grantAccess = asyncHandler(async (req, res) => {
    const { recordId, userId, userType, expiryDate } = req.body;

    const record = await MedicalRecord.findById(recordId);
    
    if (!record) {
        throw new ApiError(404, "Record not found");
    }

    if (record.patientId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to grant access");
    }

    record.authorizedUsers.push({
        userId,
        userType,
        accessExpiresAt: expiryDate
    });

    await record.save();

    return res.status(200).json(
        new ApiResponse(200, record, "Access granted successfully")
    );
});

// Revoke access from a user
const revokeAccess = asyncHandler(async (req, res) => {
    const { recordId, userId } = req.body;

    const record = await MedicalRecord.findById(recordId);
    
    if (!record) {
        throw new ApiError(404, "Record not found");
    }

    if (record.patientId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to revoke access");
    }

    record.authorizedUsers = record.authorizedUsers.filter(
        user => user.userId.toString() !== userId.toString()
    );

    await record.save();

    return res.status(200).json(
        new ApiResponse(200, record, "Access revoked successfully")
    );
});

// Get authorized records for a user
const getAuthorizedRecords = asyncHandler(async (req, res) => {
    const records = await MedicalRecord.find({
        'authorizedUsers.userId': req.user._id,
        'authorizedUsers.accessExpiresAt': { $gt: new Date() }
    });

    return res.status(200).json(
        new ApiResponse(200, records, "Authorized records fetched successfully")
    );
});

export {
    uploadMedicalRecord,
    getPatientRecords,
    grantAccess,
    revokeAccess,
    getAuthorizedRecords
}; 