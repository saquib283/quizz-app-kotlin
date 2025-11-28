import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { AxiosError } from 'axios';
import { fetchFormSchema, submitForm } from '../lib/api';
import { DynamicField, type MinimalFieldApi } from '../components/DynamicField';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Modern Toasts
import { Loader2, Send } from 'lucide-react';

interface BackendError {
    message: string;
    errors?: Record<string, string>;
}

type FormValue = string | number | boolean | string[];

export const FormPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: schema, isLoading, isError } = useQuery({
        queryKey: ['formSchema'],
        queryFn: fetchFormSchema,
    });

    const mutation = useMutation({
        mutationFn: submitForm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            toast.success('Application Submitted!', {
                description: 'Your employee onboarding record has been saved.',
            });
            navigate('/submissions');
        },
        onError: (err: AxiosError<BackendError>) => {
            const msg = err.response?.data?.message || 'Submission failed';
            const validationErrors = err.response?.data?.errors;
            toast.error(msg, {
                description: validationErrors ? 'Please check the highlighted fields.' : 'Try again later.',
            });
        }
    });

    const form = useForm({
        defaultValues: {} as Record<string, FormValue>,
        onSubmit: async ({ value }) => {
            // Simulate a small delay for better UX feel
            await new Promise(r => setTimeout(r, 500));
            mutation.mutate(value);
        },
    });

    if (isLoading) return <div className="h-[50vh] flex items-center justify-center text-blue-600"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (isError) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-8">Failed to load form schema. Ensure backend is running.</div>;

    return (
        <div className="max-w-2xl mx-auto my-12 px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
                    <h1 className="text-3xl font-bold tracking-tight">{schema?.title}</h1>
                    <p className="text-blue-100 mt-2 text-lg">{schema?.description}</p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
                        {schema?.fields.map((field) => (
                            <form.Field
                                key={field.id}
                                name={field.id}
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!field.required) return undefined;
                                        if (value === undefined || value === null) return 'Required';
                                        if (typeof value === 'string' && value.trim() === '') return 'Required';
                                        if (Array.isArray(value) && value.length === 0) return 'Required';
                                        return undefined;
                                    }
                                }}
                            >
                                {(f) => <DynamicField field={f as unknown as MinimalFieldApi} schema={field} />}
                            </form.Field>
                        ))}

                        <div className="pt-6 border-t border-slate-100 mt-8">
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                            >
                                {mutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                                {mutation.isPending ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};