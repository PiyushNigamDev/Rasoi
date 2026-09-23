import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// This module is imported while Express routes are being loaded, before the
// application entry point executes dotenv.config(). Load it here as well so
// Cloudinary always receives its credentials for recipe image updates.
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "rasoi-menu",
        public_id: filename.replace(/\.[^/.]+$/, "") + `-${Date.now()}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
