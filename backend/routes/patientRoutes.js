import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// GET all patients
router.get("/", async (req, res) => {
  try {
    const data = await Patient.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new patient (THIS IS MOST IMPORTANT)
router.post("/", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const saved = await newPatient.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE patient
router.put("/:id", async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE patient
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;  