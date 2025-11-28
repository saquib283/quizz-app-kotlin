import { formSchema } from '../data/formSchema.js';

interface ValidationErrors {
    [key: string]: string;
}

export const validateSubmission = (data: any): ValidationErrors => {
    const errors: ValidationErrors = {};

    formSchema.fields.forEach((field) => {
        const value = data[field.id];

        // 1. Check Required
        if (field.required && (value === undefined || value === null || value === '')) {
            errors[field.id] = `${field.label} is required`;
            return;
        }

        // Skip validation if optional field is empty
        if (!field.required && (value === undefined || value === null || value === '')) {
            return;
        }

        const rules = field.validation;
        if (!rules) return;

        // 2. Text Validations
        if (typeof value === 'string') {
            if (rules.minLength && value.length < rules.minLength) {
                errors[field.id] = `Min length is ${rules.minLength}`;
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                errors[field.id] = `Max length is ${rules.maxLength}`;
            }
            if (rules.regex && !new RegExp(rules.regex).test(value)) {
                errors[field.id] = `Invalid format`;
            }
        }

        // 3. Number Validations
        if (field.type === 'number') {
            const numVal = Number(value);
            if (rules.min !== undefined && numVal < rules.min) {
                errors[field.id] = `Min value is ${rules.min}`;
            }
            if (rules.max !== undefined && numVal > rules.max) {
                errors[field.id] = `Max value is ${rules.max}`;
            }
        }

        // 4. Multi-select Validations (Array)
        if (field.type === 'multi-select' && Array.isArray(value)) {
            if (rules.minSelected && value.length < rules.minSelected) {
                errors[field.id] = `Select at least ${rules.minSelected} options`;
            }
            if (rules.maxSelected && value.length > rules.maxSelected) {
                errors[field.id] = `Select at most ${rules.maxSelected} options`;
            }
        }

        // 5. Date Validations
        if (field.type === 'date' && rules.minDate) {
            const inputDate = new Date(value);
            const minDate = new Date(rules.minDate);
            if (inputDate < minDate) {
                errors[field.id] = `Date must be after ${rules.minDate}`;
            }
        }
    });

    return errors;
};