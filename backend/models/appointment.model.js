import mongoose ,{ Schema } from 'mongoose';
import  Patient  from './patient.model.js';
import  Doctor  from './doctor.model.js';


const appointmentSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
     appointmentTime: {
    type: String, // or Date if you're storing full timestamp
    required: false
  },
    pateintMobile:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;