import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import sendMessage from '../controllers/contact/sendMessage';

const router = Router();

router.post('/send-message', rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 1,
    message: { error: true, message: "Please wait before retrying.", payload: [] }
}), sendMessage);

export default router;
