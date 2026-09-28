import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Building,
  Clock,
  Send,
  MessageSquare,
  Edit,
  Trash2,
} from 'lucide-react';
import { Lead, LeadStatus, leadApi } from '../api/leadApi';

interface LeadDetailsDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONTACTED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SITE_VISIT: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  CLOSED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  leadId,
  onClose,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => leadApi.getLeadById(leadId!),
    enabled: !!leadId,
  });

  const lead = data?.data;

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: LeadStatus) => leadApi.updateLead(leadId!, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => leadApi.addLeadNote(leadId!, content),
    onSuccess: () => {
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  if (!leadId) return null;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote.trim());
  };

  const formatBudget = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lead Overview
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {lead && (
                <>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Lead"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          {isLoading || !lead ? (
            <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-sm">
              Loading lead details...
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
                    <p className="text-xs text-slate-500">Source: {lead.source.replace('_', ' ')}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      statusColors[lead.status]?.bg || 'bg-slate-100'
                    } ${statusColors[lead.status]?.text || 'text-slate-700'} ${
                      statusColors[lead.status]?.border || 'border-slate-200'
                    }`}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Quick Status Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Update Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['NEW', 'CONTACTED', 'SITE_VISIT', 'CLOSED'] as LeadStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatusMutation.mutate(st)}
                        disabled={lead.status === st || updateStatusMutation.isPending}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${
                          lead.status === st
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3 text-sm">
                <div className="flex items-center text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <a href={`tel:${lead.phone}`} className="hover:underline text-blue-600 font-medium">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="hover:underline text-blue-600">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <span>{lead.location}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <IndianRupee className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <span className="font-semibold text-slate-900">{formatBudget(lead.budget)}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Building className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <span>{lead.propertyType.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                    Notes & Activity ({lead.notes?.length || 0})
                  </h3>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNoteSubmit} className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a call log, update or note..."
                    rows={3}
                    className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newNote.trim() || addNoteMutation.isPending}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{addNoteMutation.isPending ? 'Saving...' : 'Add Note'}</span>
                    </button>
                  </div>
                </form>

                {/* List of Notes */}
                <div className="space-y-3">
                  {lead.notes && lead.notes.length > 0 ? (
                    lead.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1 text-xs"
                      >
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <div className="flex items-center text-[10px] text-slate-400 pt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No notes recorded yet for this lead.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
