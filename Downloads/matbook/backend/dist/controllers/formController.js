import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { formSchema } from '../data/formSchema.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/ApiError.js';
export const getFormSchema = catchAsync(async (req, res) => {
    res.status(200).json(formSchema);
});
export const submitForm = catchAsync(async (req, res, next) => {
    const data = req.body;
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO submissions (id, data, createdAt) VALUES (?, ?, ?)');
    const info = stmt.run(id, JSON.stringify(data), createdAt);
    if (info.changes === 0) {
        return next(new AppError('Failed to save submission', 500));
    }
    res.status(201).json({
        success: true,
        id,
        createdAt
    });
});
export const getSubmissions = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const search = req.query.search;
    const offset = (page - 1) * limit;
    let whereClause = '';
    const params = [];
    if (search) {
        whereClause = 'WHERE data LIKE ?';
        params.push(`%${search}%`);
    }
    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM submissions ${whereClause}`);
    const totalResult = countStmt.get(...params);
    const stmt = db.prepare(`
    SELECT id, data, createdAt 
    FROM submissions 
    ${whereClause}
    ORDER BY createdAt ${sortOrder} 
    LIMIT ? OFFSET ?
  `);
    const rows = stmt.all(...params, limit, offset);
    res.status(200).json({
        success: true,
        data: rows.map(row => ({ ...row, data: JSON.parse(row.data) })),
        meta: {
            total: totalResult.total,
            page,
            limit,
            totalPages: Math.ceil(totalResult.total / limit)
        }
    });
});
export const deleteSubmission = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM submissions WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) {
        return next(new AppError('No submission found with that ID', 404));
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
export const updateSubmission = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const stmt = db.prepare('UPDATE submissions SET data = ? WHERE id = ?');
    const info = stmt.run(JSON.stringify(data), id);
    if (info.changes === 0) {
        return next(new AppError('No submission found with that ID', 404));
    }
    res.status(200).json({ success: true, message: 'Updated successfully' });
});
//# sourceMappingURL=formController.js.map