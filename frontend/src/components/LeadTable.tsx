import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
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
  NEW: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  CONTACTED: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  SITE_VISIT: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  CLOSED: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
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
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
        Loading leads data...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm space-y-2">
        <p className="font-semibold text-slate-700">No leads found</p>
        <p className="text-xs text-slate-400">Try adjusting your search criteria or add a new lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Lead Name</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Budget & Type</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Name */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center mt-0.5">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    <span>{lead._count?.notes || 0} notes</span>
                  </div>
                </td>

                {/* Contact */}
                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="flex items-center text-slate-700">
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
                  <div className="font-semibold text-slate-900">{formatBudget(lead.budget)}</div>
                  <div className="text-[11px] text-slate-500">{lead.propertyType.replace('_', ' ')}</div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                    <span className="truncate max-w-[140px]">{lead.location}</span>
                  </div>
                </td>

                {/* Source */}
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium text-[11px]">
                    {lead.source.replace('_', ' ')}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-medium ${
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
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteLead(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      Delete
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
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold">{leads.length}</span> of{' '}
            <span className="font-semibold">{pagination.total}</span> leads
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
