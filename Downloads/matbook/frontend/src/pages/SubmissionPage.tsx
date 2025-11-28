"use no memo";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import { fetchSubmissions, type Submission } from '../lib/api';
import { ChevronLeft, ChevronRight, ArrowUpDown, Eye, Loader2, Database } from 'lucide-react';
import clsx from 'clsx';

const columnHelper = createColumnHelper<Submission>();

export const SubmissionsPage = () => {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['submissions', pagination.pageIndex, pagination.pageSize, sortOrder],
        queryFn: () => fetchSubmissions(pagination.pageIndex + 1, pagination.pageSize, sortOrder),
        placeholderData: (prev) => prev,
    });

    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: info => <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{info.getValue().slice(0, 8)}</span>
        }),
        columnHelper.accessor('createdAt', {
            header: () => (
                <button
                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-semibold group"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    Date Submitted
                    <span className={clsx("p-1 rounded bg-slate-100 group-hover:bg-blue-100 transition-colors", sortOrder === 'asc' ? "rotate-180" : "")}>
                        <ArrowUpDown size={14} className="text-slate-500 group-hover:text-blue-600" />
                    </span>
                </button>
            ),
            cell: info => <span className="text-slate-600 font-medium">{new Date(info.getValue()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedSubmission(row.original)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Eye size={16} /> View
                </button>
            )
        })
    ];

    const table = useReactTable({
        data: data?.data || [],
        columns,
        pageCount: data?.meta.totalPages ?? -1,
        state: { pagination },
        onPaginationChange: setPagination,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /><p>Loading data...</p></div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading data.</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage and view all form submissions</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-xs font-medium text-slate-500 pl-2">Rows:</span>
                    <select
                        value={pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="bg-slate-50 border-0 rounded-md text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors py-1.5"
                    >
                        {[10, 20, 50].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Database size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-600">No submissions found</p>
                                        <p className="text-sm">New entries will appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="p-4 text-sm">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
                        Page <span className="text-slate-900">{table.getState().pagination.pageIndex + 1}</span> of {data?.meta.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Submission Details</h2>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-5">
                            {Object.entries(selectedSubmission.data).map(([key, value]) => (
                                <div key={key} className="group">
                                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{key}</dt>
                                    <dd className="text-sm text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:border-blue-200 transition-colors break-words">
                                        {Array.isArray(value)
                                            ? (value.length ? value.join(', ') : <span className="text-slate-400 italic">None selected</span>)
                                            : (String(value) || <span className="text-slate-400 italic">Empty</span>)
                                        }
                                    </dd>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};