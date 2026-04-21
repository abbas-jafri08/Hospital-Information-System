import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  diagnosis: String,
  treatment: String
}, { timestamps: true });

export default mongoose.model("MedicalRecord", medicalSchema);