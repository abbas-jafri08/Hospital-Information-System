import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });