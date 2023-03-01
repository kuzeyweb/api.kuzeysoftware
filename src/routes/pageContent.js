import { Router } from 'express';
import multer from 'multer';
import getContent from '../controllers/page-content/getContent';
import updateContent from '../controllers/page-content/updateContent';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "")}`)
    }
})

const fileFilter = function (req, file, cb) {
    // Only allow jpg, png, and webp files
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB file size limit
    },
    fileFilter: fileFilter
})

router.get('/', getContent);

router.post('/', upload.any(), updateContent);

export default router;
