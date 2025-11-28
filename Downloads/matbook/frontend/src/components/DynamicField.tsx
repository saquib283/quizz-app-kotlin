import { type FieldSchema } from '../lib/api';
import clsx from 'clsx';

type FormValue = string | number | boolean | string[] | undefined;

export interface MinimalFieldApi {
    state: {
        value: FormValue;
        meta: {
            errors: (string | undefined | null)[];
        };
    };
    handleChange: (val: FormValue) => void;
    handleBlur: () => void;
}

export const DynamicField = ({ field, schema }: { field: MinimalFieldApi, schema: FieldSchema }) => {
    const { state, handleChange, handleBlur } = field;
    const errors = state.meta.errors ? state.meta.errors.filter((e) => Boolean(e)) : [];
    const hasError = errors.length > 0;

    // Modern Input Styles
    const baseInputStyles = clsx(
        "w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none",
        "placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed",
        hasError
            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900"
            : "border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900"
    );

    return (
        <div className="mb-6 group">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-0.5">
                {schema.label}
                {schema.required && <span className="text-red-500 ml-1" title="Required">*</span>}
            </label>

            {/* TEXT, NUMBER, DATE */}
            {['text', 'number', 'date'].includes(schema.type) && (
                <input
                    type={schema.type}
                    value={(state.value as string | number) ?? ''}
                    placeholder={schema.placeholder}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    className={baseInputStyles}
                />
            )}

            {/* TEXTAREA */}
            {schema.type === 'textarea' && (
                <textarea
                    value={(state.value as string) ?? ''}
                    placeholder={schema.placeholder}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    className={clsx(baseInputStyles, "min-h-[120px] resize-y")}
                />
            )}

            {/* SELECT */}
            {schema.type === 'select' && (
                <div className="relative">
                    <select
                        value={(state.value as string) ?? ''}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className={clsx(baseInputStyles, "appearance-none bg-no-repeat bg-right pr-10")}
                    >
                        <option value="">Select an option...</option>
                        {schema.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            )}

            {/* SWITCH */}
            {schema.type === 'switch' && (
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleChange(!state.value)}
                        className={clsx(
                            "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                            state.value ? "bg-blue-600" : "bg-slate-200"
                        )}
                    >
                        <span className={clsx("pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", state.value ? "translate-x-5" : "translate-x-0")} />
                    </button>
                    <span className="text-sm text-slate-500">{state.value ? 'Yes' : 'No'}</span>
                </div>
            )}

            {/* MULTI-SELECT */}
            {schema.type === 'multi-select' && (
                <div className={clsx("grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border transition-all", hasError ? "border-red-200 bg-red-50/30" : "border-slate-200 bg-slate-50/50")}>
                    {schema.options?.map((opt) => {
                        const current = (state.value as string[]) || [];
                        const isSelected = current.includes(opt.value);
                        return (
                            <label key={opt.value} className={clsx(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none group",
                                isSelected
                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                    : "bg-white border-transparent hover:border-slate-200"
                            )}>
                                <div className={clsx(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                    isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                                )}>
                                    {isSelected && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => isSelected
                                        ? handleChange(current.filter(v => v !== opt.value))
                                        : handleChange([...current, opt.value])
                                    }
                                />
                                <span className={clsx("text-sm font-medium", isSelected ? "text-blue-700" : "text-slate-600")}>{opt.label}</span>
                            </label>
                        )
                    })}
                </div>
            )}

            {/* Error Message with Animation */}
            {hasError && (
                <div className="mt-2 flex items-center gap-1.5 text-red-600 animate-in slide-in-from-top-1 fade-in duration-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs font-medium">{errors.join(', ')}</p>
                </div>
            )}
        </div>
    );
};