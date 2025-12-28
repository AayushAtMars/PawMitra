import express from "express";
import { updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { handleUploadError, uploadSingle } from "../middleware/upload.js";

const router = express.Router();

// The order matters: Protect -> Upload -> Check Errors -> Run Logic
router.put("/update-profile", protect, uploadSingle, handleUploadError, updateProfile);

export default router;