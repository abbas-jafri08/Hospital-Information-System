import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: String,
  time: String,
  status: String
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);