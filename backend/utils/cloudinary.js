import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
 cloud_name: "dgg3mhrz7",
  api_key: "737438742735232",
  api_secret: "ta_NvH3FKKW5VrYGhnd1aNHRdes",


});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

export { cloudinary, storage };
