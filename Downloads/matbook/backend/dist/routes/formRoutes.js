import { Router } from 'express';
import { getFormSchema, submitForm, getSubmissions, deleteSubmission, updateSubmission } from '../controllers/formController.js';
import { validateSchemaMiddleware } from '../middleware/validate.js';
const router = Router();
router.get('/form-schema', getFormSchema);
router.get('/submissions', getSubmissions);
router.post('/submissions', validateSchemaMiddleware, submitForm);
router.put('/submissions/:id', validateSchemaMiddleware, updateSubmission);
router.delete('/submissions/:id', deleteSubmission);
export default router;
//# sourceMappingURL=formRoutes.js.map