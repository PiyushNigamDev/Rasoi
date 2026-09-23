import multer from "multer";
import { uploadToCloudinary } from "../config/cloudinary.js";

const storage = multer.memoryStorage();
const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

export const uploadSingleImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    req.file.cloudinaryUrl = result.secure_url;
    req.file.filename = result.public_id;
    next();
  } catch (error) {
    console.error("Recipe image upload failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "The recipe image could not be uploaded. Please try again.",
    });
  }
};

export default uploads;
