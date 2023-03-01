import { Router } from 'express';
import createUser from '../controllers/users/createUser';
import deleteUser from '../controllers/users/deleteUser';
import getUsers from '../controllers/users/getUsers';
import updateUser from '../controllers/users/updateUser';
import multer from 'multer';

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

router.get('/', getUsers);

router.post('/', upload.any(), createUser);

router.patch('/:id', upload.any(), updateUser);

router.delete('/:id', deleteUser);

export default router;
