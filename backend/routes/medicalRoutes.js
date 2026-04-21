import express from "express";
import MedicalRecord from "../models/MedicalRecord.js"; // ✅ correct name

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const data = await MedicalRecord.find();
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newData = new MedicalRecord(req.body);
  await newData.save();
  res.json(newData);
});

// PUT
router.put("/:id", async (req, res) => {
  const updated = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await MedicalRecord.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;