import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";

const clubStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "college/clubs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const clubUpload = multer({ storage: clubStorage });
