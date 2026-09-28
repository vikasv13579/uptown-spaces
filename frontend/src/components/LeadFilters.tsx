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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search leads by name, email, phone, location..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* View Mode Toggles & Create Button */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-medium flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium flex items-center mr-1">
          <Filter className="w-3.5 h-3.5 mr-1" /> Filters:
        </span>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="CLOSED">Closed</option>
        </select>

        {/* Source Filter */}
        <select
          value={filters.source || ''}
          onChange={handleSourceChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Sources</option>
          <option value="WEBSITE">Website</option>
          <option value="GOOGLE">Google Ads</option>
          <option value="FACEBOOK">Facebook Ads</option>
          <option value="REFERRAL">Referral</option>
          <option value="WALK_IN">Walk-in</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Property Type Filter */}
        <select
          value={filters.propertyType || ''}
          onChange={handlePropertyTypeChange}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
