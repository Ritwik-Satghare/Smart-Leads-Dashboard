import { Router } from 'express';
import * as leadsController from '../controllers/leads.controller';
import { authenticate, validate } from '../middleware';
import { createLeadSchema, updateLeadSchema } from '../validations/leads.validation';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.post('/', validate(createLeadSchema), leadsController.create);
router.get('/', leadsController.getAll);
router.get('/:id', leadsController.getOne);
router.put('/:id', validate(updateLeadSchema), leadsController.update);
router.delete('/:id', leadsController.remove);

export default router;
