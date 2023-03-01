import { Router } from 'express';
import createCategory from '../controllers/categories/createCategory';
import deleteCategory from '../controllers/categories/deleteCategory';
import getCategories from '../controllers/categories/getCategories';
import updateCategory from '../controllers/categories/updateCategory';


const router = Router();

router.post('/', createCategory);

router.get('/', getCategories);

router.patch('/:id', updateCategory);

router.delete('/:id', deleteCategory);

export default router;
