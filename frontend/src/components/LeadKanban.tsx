import React from 'react';
import { Phone, MapPin, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { Lead, LeadStatus } from '../api/leadApi';

interface LeadKanbanProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOpenCreateModal: () => void;
}

const COLUMNS: { id: LeadStatus; title: string; color: string; badge: string }[] = [
  { id: 'NEW', title: 'New Inquiries', color: 'bg-sky-500', badge: 'bg-sky-100 text-sky-800' },
  { id: 'CONTACTED', title: 'Pitching & Follow-Up', color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800' },
  { id: 'SITE_VISIT', title: 'Site Visits', color: 'bg-indigo-600', badge: 'bg-indigo-100 text-indigo-800' },
  { id: 'CLOSED', title: 'Closed Deals', color: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-800' },
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
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-400 text-xs">
        Loading pipeline board...
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
            className="bg-slate-100/60 border border-slate-200/80 rounded-xl p-3.5 flex flex-col max-h-[80vh]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="font-bold text-xs text-slate-800 tracking-tight">{column.title}</h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${column.badge}`}>
                  {columnLeads.length}
                </span>
              </div>
              {column.id === 'NEW' && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Add Lead"
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
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition-colors">
                        {lead.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/60">
                        {lead.propertyType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600">
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
                      <span className="font-extrabold text-slate-900">{formatBudget(lead.budget)}</span>

                      <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-medium">
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {lead._count?.notes || 0}
                        </span>
                      </div>
                    </div>

                    {/* Move Quick Actions */}
                    <div className="pt-1.5 flex items-center gap-1 flex-wrap">
                      {COLUMNS.filter((c) => c.id !== lead.status).map((c) => (
                        <button
                          key={c.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(lead.id, c.id);
                          }}
                          className="px-2 py-0.5 text-[9px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md transition-colors flex items-center space-x-1"
                        >
                          <span>Move {c.title.split(' ')[0]}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50">
                  No clients in {column.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
