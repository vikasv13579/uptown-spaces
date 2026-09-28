import React from 'react';
import { Phone, MapPin, MessageSquare, Plus } from 'lucide-react';
import { Lead, LeadStatus } from '../api/leadApi';

interface LeadKanbanProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOpenCreateModal: () => void;
}

const COLUMNS: { id: LeadStatus; title: string; color: string; border: string }[] = [
  { id: 'NEW', title: 'New Leads', color: 'bg-blue-500', border: 'border-blue-200' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-amber-500', border: 'border-amber-200' },
  { id: 'SITE_VISIT', title: 'Site Visit', color: 'bg-purple-500', border: 'border-purple-200' },
  { id: 'CLOSED', title: 'Closed Deal', color: 'bg-emerald-500', border: 'border-emerald-200' },
];

export const LeadKanban: React.FC<LeadKanbanProps> = ({
  leads,
  isLoading,
  onSelectLead,
  onUpdateStatus,
  onOpenCreateModal,
}) => {
  const formatBudget = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
        Loading board columns...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((column) => {
        const columnLeads = leads.filter((l) => l.status === column.id);

        return (
          <div
            key={column.id}
            className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col max-h-[80vh]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="font-bold text-sm text-slate-800">{column.title}</h3>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                  {columnLeads.length}
                </span>
              </div>
              {column.id === 'NEW' && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3 overflow-y-auto pr-1">
              {columnLeads.length > 0 ? (
                columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {lead.propertyType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
                        <span className="truncate">{lead.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{formatBudget(lead.budget)}</span>

                      <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {lead._count?.notes || 0}
                        </span>
                      </div>
                    </div>

                    {/* Move Quick Actions */}
                    <div className="pt-1 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {COLUMNS.filter((c) => c.id !== lead.status).map((c) => (
                        <button
                          key={c.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, c.id);
                          }}
                          className="px-1.5 py-0.5 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded transition-colors"
                        >
                          → {c.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No leads in {column.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
