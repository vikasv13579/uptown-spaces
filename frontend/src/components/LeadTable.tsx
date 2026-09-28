import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Lead, LeadStatus } from '../api/leadApi';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

const statusBadges: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  NEW: { bg: 'bg-sky-50 border-sky-200/90', text: 'text-sky-800', dot: 'bg-sky-500' },
  CONTACTED: { bg: 'bg-amber-50 border-amber-200/90', text: 'text-amber-900', dot: 'bg-amber-500' },
  SITE_VISIT: { bg: 'bg-indigo-50 border-indigo-200/90', text: 'text-indigo-900', dot: 'bg-indigo-600' },
  CLOSED: { bg: 'bg-emerald-50 border-emerald-200/90', text: 'text-emerald-900', dot: 'bg-emerald-600' },
};

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  pagination,
  onPageChange,
}) => {
  const formatBudget = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-400 text-xs">
        Loading directory records...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-500 text-xs space-y-2">
        <p className="font-bold text-slate-700">No client records found</p>
        <p className="text-slate-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th className="py-3.5 px-4">Budget & Requirement</th>
              <th className="py-3.5 px-4">Preferred Location</th>
              <th className="py-3.5 px-4">Lead Source</th>
              <th className="py-3.5 px-4">Current Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-amber-50/20 cursor-pointer transition-colors group"
              >
                {/* Name */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {lead.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center mt-0.5 font-medium">
                    <MessageSquare className="w-3 h-3 mr-1 text-slate-400" />
                    <span>{lead._count?.notes || 0} notes</span>
                  </div>
                </td>

                {/* Contact */}
                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="flex items-center text-slate-700 font-medium">
                    <Phone className="w-3 h-3 text-slate-400 mr-1.5" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Mail className="w-3 h-3 text-slate-400 mr-1.5" />
                    <span>{lead.email}</span>
                  </div>
                </td>

                {/* Budget */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{formatBudget(lead.budget)}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{lead.propertyType.replace('_', ' ')}</div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="flex items-center font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                    <span className="truncate max-w-[140px]">{lead.location}</span>
                  </div>
                </td>

                {/* Source */}
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-0.5 bg-slate-100/80 text-slate-600 border border-slate-200/60 rounded-md font-semibold text-[10px] tracking-wide">
                    {lead.source.replace('_', ' ')}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
                      statusBadges[lead.status]?.bg
                    } ${statusBadges[lead.status]?.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadges[lead.status]?.dot}`}
                    />
                    {lead.status.replace('_', ' ')}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEditLead(lead)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLead(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-800">{leads.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
