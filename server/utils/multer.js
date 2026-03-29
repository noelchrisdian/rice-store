import multer from 'multer';
import { BadRequest } from '../errors/badRequest.js';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary'; 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new BadRequest('Invalid file format'), false)
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
})

const cloudinaryUploader = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: `rice-store/${folder}` }, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        })

        Readable.from(buffer).pipe(stream);
    })
}

export {
    cloudinaryUploader,
    upload
}