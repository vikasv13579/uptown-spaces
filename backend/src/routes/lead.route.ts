import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  createLeadNote,
  getLeadNotes,
  getLeadStats,
} from '../controllers/lead.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadByIdSchema,
  deleteLeadSchema,
  createNoteSchema,
  getLeadsQuerySchema,
} from '../validators/lead.validator.js';

const router = Router();

router.post('/', validateRequest(createLeadSchema), createLead);
router.get('/', validateRequest(getLeadsQuerySchema), getLeads);
router.get('/stats', getLeadStats);

router.get('/:id', validateRequest(getLeadByIdSchema), getLeadById);
router.patch('/:id', validateRequest(updateLeadSchema), updateLead);
router.delete('/:id', validateRequest(deleteLeadSchema), deleteLead);

router.post('/:id/notes', validateRequest(createNoteSchema), createLeadNote);
router.get('/:id/notes', validateRequest(getLeadByIdSchema), getLeadNotes);

export default router;
