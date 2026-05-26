import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function extractPublicId(url) {
    const parts = url.split("/");
    const file = parts.pop();        // example: abc123.png
    const folder = parts.pop();      // example: products
    return `${folder}/${file.split(".")[0]}`;
}

const deleteFromCloudinary = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl);
    return cloudinary.uploader.destroy(publicId);
};


export {cloudinary, deleteFromCloudinary};
