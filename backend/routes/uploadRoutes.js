import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import path from 'path';
const router = express.Router();

let storage;
if (process.env.NODE_ENV === 'production') {
  // Cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });
} else {
  // التخزين المحلي
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
  });
}

const upload = multer({ storage });
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image:
          process.env.NODE_ENV === 'production'
            ? req.file.path // رابط Cloudinary
            : `/${req.file.path}`, // رابط محلي
      });
    } else {
      res.status(400).send({ message: 'No image file provided' });
    }
  });
});

export default router;

