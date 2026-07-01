import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createOne, deleteOne, getOne, listTasks, updateOne, adminUsers } from '../../controllers/task.controller.js';
import { taskCreateSchema, taskUpdateSchema } from '../../schemas/task.schema.js';

const router = Router();

router.get('/tasks', authenticate, listTasks);
router.post('/tasks', authenticate, validate(taskCreateSchema), createOne);
router.get('/tasks/:id', authenticate, getOne);
router.patch('/tasks/:id', authenticate, validate(taskUpdateSchema), updateOne);
router.delete('/tasks/:id', authenticate, deleteOne);

router.get('/admin/users', authenticate, authorize('ADMIN'), adminUsers);

export default router;
