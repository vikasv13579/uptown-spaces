import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi, Lead, LeadFilters as FiltersType, LeadStatus, CreateLeadInput } from '../api/leadApi';
import { LeadFilters } from '../components/LeadFilters';
import { LeadTable } from '../components/LeadTable';
import { LeadKanban } from '../components/LeadKanban';
import { LeadModal } from '../components/LeadModal';
import { LeadDetailsDrawer } from '../components/LeadDetailsDrawer';

export const LeadsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [filters, setFilters] = useState<FiltersType>({ page: 1, limit: 10 });

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Fetch Leads Query
  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadApi.getLeads(filters),
  });

  const leads = data?.data || [];
  const pagination = data?.pagination;

  // Create/Update Lead Mutation
  const saveLeadMutation = useMutation({
    mutationFn: (input: CreateLeadInput) => {
      if (editingLead) {
        return leadApi.updateLead(editingLead.id, input);
      }
      return leadApi.createLead(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      setIsModalOpen(false);
      setEditingLead(null);
    },
  });

  // Delete Lead Mutation
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      if (selectedLeadId) setSelectedLeadId(null);
    },
  });

  // Quick Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadApi.updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
    },
  });

  const handleOpenCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleQuickUpdateStatus = (id: string, status: LeadStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-xs text-slate-500">
            Track, filter, and convert prospects through your real estate pipeline.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <LeadFilters
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main View (Table or Kanban) */}
      {viewMode === 'table' ? (
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onSelectLead={(lead) => setSelectedLeadId(lead.id)}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          pagination={pagination}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      ) : (
        <LeadKanban
          leads={leads}
          isLoading={isLoading}
          onSelectLead={(lead) => setSelectedLeadId(lead.id)}
          onUpdateStatus={handleQuickUpdateStatus}
          onOpenCreateModal={handleOpenCreateModal}
        />
      )}

      {/* Create / Edit Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={async (input) => {
          await saveLeadMutation.mutateAsync(input);
        }}
        initialData={editingLead}
        isLoading={saveLeadMutation.isPending}
      />

      {/* Details Slide-out Drawer */}
      <LeadDetailsDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
      />
    </div>
  );
};
