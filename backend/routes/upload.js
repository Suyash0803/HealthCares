import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const upload = multer({ storage });
const router = express.Router();

// Upload single image
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // path is the Cloudinary URL
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;
