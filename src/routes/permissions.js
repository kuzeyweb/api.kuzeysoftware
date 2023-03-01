import { Router } from 'express';
import assignPermissions from '../controllers/permissions/assignPermissions'
import getPermissions from '../controllers/permissions/getPermissions'

const router = Router();

router.get('/', getPermissions);

router.put('/assign', assignPermissions);

export default router;
