import { validateSubmission } from '../utils/validator.js';
import { AppError } from '../utils/ApiError.js';
export const validateSchemaMiddleware = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const errors = validateSubmission(req.body);
        if (Object.keys(errors).length > 0) {
            // Pass errors to AppError to match assignment format: { success: false, errors: {...} }
            return next(new AppError('Validation failed', 400, errors));
        }
    }
    next();
};
//# sourceMappingURL=validate.js.map