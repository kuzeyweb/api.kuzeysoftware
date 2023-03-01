import { Router } from 'express';
import createBlog from '../controllers/blogs/createBlog'
import multer from 'multer';
import getBlogs from '../controllers/blogs/getBlogs';
import getBlog from '../controllers/blogs/getBlog';
import updateBlog from '../controllers/blogs/updateBlog';
import deleteBlog from '../controllers/blogs/deleteBlog';

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

router.post('/', upload.any(), createBlog);

router.get('/', getBlogs);

router.get('/:slug', getBlog);

router.patch('/:id', upload.any(), updateBlog);

router.delete('/:id', deleteBlog);

export default router;
