import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import User from "../models/User.js"; // Adjust path to your User Model

// Add these to your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;
    let avatarUrl;

    // 1. Upload to Cloudinary (if file exists)
    if (req.file) {
      avatarUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_avatars" },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    // 2. Prepare Update Data
    const updates = { name, phone, bio };
    if (avatarUrl) updates.avatar = avatarUrl;

    // 3. Update MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Assumes you have auth middleware
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};