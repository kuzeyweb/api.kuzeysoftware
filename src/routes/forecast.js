import { Router } from 'express';
import getForecast from '../controllers/forecast/getForecast';

const router = Router();

router.get('/', getForecast);

export default router;
