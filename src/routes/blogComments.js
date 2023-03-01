import { Router } from 'express';
import createComment from '../controllers/blog-comments/createComment';
import getComments from '../controllers/blog-comments/getComments';
import updateCommentStatus from '../controllers/blog-comments/updateCommentStatus';
import deleteComment from '../controllers/blog-comments/deleteComment';
import getPostComments from '../controllers/blog-comments/getPostComments';

const router = Router();

router.post('/:blog_id', createComment);

router.get('/', getComments);

router.get('/:blog_id', getPostComments);

router.patch('/:comment_id', updateCommentStatus);

router.delete('/:comment_id', deleteComment);

export default router;
