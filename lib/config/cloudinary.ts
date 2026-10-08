import { v2 as cloudinary } from "cloudinary";
import { secretEnv } from "./env";

cloudinary.config({
  cloud_name: secretEnv.CLOUDINARY_CLOUD_NAME,
  api_key: secretEnv.CLOUDINARY_API_KEY,
  api_secret: secretEnv.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
