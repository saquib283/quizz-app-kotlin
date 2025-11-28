import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export type FormValue = string | number | boolean | string[] | undefined;

export interface FieldSchema {
    id: string;
    type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'textarea' | 'switch';
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    validation?: {
        minLength?: number;
        maxLength?: number;
        regex?: string;
        min?: number;
        max?: number;
        minDate?: string;
        minSelected?: number;
        maxSelected?: number;
    };
}

export interface FormSchema {
    title: string;
    description: string;
    fields: FieldSchema[];
}

export interface Submission {
    id: string;
    // 2. Use the strict type here
    data: Record<string, FormValue>;
    createdAt: string;
}

export interface SubmissionResponse {
    success: boolean;
    data: Submission[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// API Calls
export const fetchFormSchema = async () => {
    const { data } = await api.get<FormSchema>('/form-schema');
    return data;
};

// 3. Use the strict type here as well
export const submitForm = async (formData: Record<string, FormValue>) => {
    const { data } = await api.post('/submissions', formData);
    return data;
};

export const fetchSubmissions = async (page: number, limit: number, sortOrder: 'asc' | 'desc') => {
    const { data } = await api.get<SubmissionResponse>('/submissions', {
        params: { page, limit, sortOrder, sortBy: 'createdAt' }
    });
    return data;
};