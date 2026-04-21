import express from "express";
import Billing from "../models/Billing.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const data = await Billing.find();
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newData = new Billing(req.body);
  await newData.save();
  res.json(newData);
});

// PUT
router.put("/:id", async (req, res) => {
  const updated = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Billing.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;