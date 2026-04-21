import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    gender: String,
    disease: String,
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);