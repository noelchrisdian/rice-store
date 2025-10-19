import multer from 'multer';
import { BadRequest } from '../errors/badRequest.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary'; 

const formats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'rice-store',
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp']
    }
})

const filter = (req, file, cb) => {
    if (!formats.includes(file.mimetype)) {
        cb(new BadRequest('Invalid file format'), false);
    }
    
    cb(null, true);
}

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: filter
})

export {
    upload
}