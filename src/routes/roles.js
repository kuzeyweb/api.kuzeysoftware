import { Router } from 'express';
import createRole from '../controllers/roles/createRole'
import updateRole from '../controllers/roles/updateRole'
import deleteRole from '../controllers/roles/deleteRole'
import assignRoles from '../controllers/roles/assignRoles'
import getRoles from '../controllers/roles/getRoles';

const router = Router();

router.post('/', createRole);

router.get('/', getRoles);

router.patch('/:id', updateRole);

router.delete('/:id', deleteRole);

router.put('/assign', assignRoles);

export default router;
