import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadimageCloudinary = async (image) => {
  if (!image || !image.buffer) {
    throw new Error('No file buffer found');
  }

  const buffer = image.buffer;

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "ECommerce", resource_type: "auto" }, // resource_type:auto taake images/docs sab chalein
      (error, uploadResult) => {
        if (error) return reject(error);
        resolve(uploadResult);
      }
    ).end(buffer);
  });

  return uploadImage;
};

export default uploadimageCloudinary;
