import React from 'react';
import { Search, Filter, Plus, LayoutGrid, ListFilter, RotateCcw } from 'lucide-react';
import { LeadFilters as FiltersType, LeadStatus, LeadSource, PropertyType } from '../api/leadApi';

interface LeadFiltersProps {
  filters: FiltersType;
  onChange: (newFilters: FiltersType) => void;
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  onOpenCreateModal: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LeadStatus | '';
    onChange({ ...filters, status: val || undefined, page: 1 });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LeadSource | '';
    onChange({ ...filters, source: val || undefined, page: 1 });
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PropertyType | '';
    onChange({ ...filters, propertyType: val || undefined, page: 1 });
  };

  const handleReset = () => {
    onChange({ page: 1, limit: 10 });
  };

  const hasActiveFilters = !!(filters.search || filters.status || filters.source || filters.propertyType);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-card space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search leads by client name, email, phone, location..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        {/* View Mode Toggles & Create Button */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Pipeline Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-bold flex items-center mr-1 text-[11px] uppercase tracking-wider">
          <Filter className="w-3 h-3 mr-1" /> Filters:
        </span>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New Inquiries</option>
          <option value="CONTACTED">Contacted</option>
          <option value="SITE_VISIT">Site Visit Scheduled</option>
          <option value="CLOSED">Closed Deals</option>
        </select>

        {/* Source Filter */}
        <select
          value={filters.source || ''}
          onChange={handleSourceChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="">All Lead Sources</option>
          <option value="WEBSITE">Website Direct</option>
          <option value="GOOGLE">Google Ads</option>
          <option value="FACEBOOK">Facebook Ads</option>
          <option value="REFERRAL">Direct Referral</option>
          <option value="WALK_IN">Walk-In Visitor</option>
          <option value="OTHER">Other Channels</option>
        </select>

        {/* Property Type Filter */}
        <select
          value={filters.propertyType || ''}
          onChange={handlePropertyTypeChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="">All Property Types</option>
          <option value="ONE_BHK">1 BHK</option>
          <option value="TWO_BHK">2 BHK</option>
          <option value="THREE_BHK">3 BHK</option>
          <option value="VILLA">Villa</option>
          <option value="PLOT">Plot</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg flex items-center space-x-1 transition-colors font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
