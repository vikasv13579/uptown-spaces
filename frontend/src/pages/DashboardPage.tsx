import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react';
import { leadApi, LeadStatus, LeadSource } from '../api/leadApi';

const statusLabels: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  NEW: { label: 'New Leads', color: 'text-blue-600', bg: 'bg-blue-500' },
  CONTACTED: { label: 'Contacted', color: 'text-amber-600', bg: 'bg-amber-500' },
  SITE_VISIT: { label: 'Site Visit Scheduled', color: 'text-purple-600', bg: 'bg-purple-500' },
  CLOSED: { label: 'Closed Deals', color: 'text-emerald-600', bg: 'bg-emerald-500' },
};

const sourceLabels: Record<LeadSource, string> = {
  WEBSITE: 'Website Direct',
  GOOGLE: 'Google Ads',
  FACEBOOK: 'Facebook Ads',
  REFERRAL: 'Referral',
  WALK_IN: 'Walk-in Client',
  OTHER: 'Other Channels',
};

export const DashboardPage: React.FC = () => {
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['leadStats'],
    queryFn: () => leadApi.getLeadStats(),
  });

  const { data: recentData, isLoading: isRecentLoading } = useQuery({
    queryKey: ['leads', { limit: 5 }],
    queryFn: () => leadApi.getLeads({ limit: 5 }),
  });

  const stats = statsData?.data;
  const recentLeads = recentData?.data || [];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakh`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const totalLeads = stats?.totalLeads || 0;
  const closedLeads = stats?.statusCounts?.CLOSED || 0;
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Real Estate Lead CRM</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to EstateCRM Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor real-time pipeline performance, lead conversion rates, and revenue potential.
          </p>
        </div>
        <Link
          to="/leads"
          className="self-start md:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <span>Manage All Leads</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Pipeline Leads</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {isStatsLoading ? '...' : totalLeads}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active prospects in database</p>
          </div>
        </div>

        {/* Total Pipeline Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Potential Value</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {isStatsLoading ? '...' : formatCurrency(stats?.totalBudget || 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Aggregated client budgets</p>
          </div>
        </div>

        {/* Closed Deals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Closed Deals</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {isStatsLoading ? '...' : closedLeads}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Successfully converted leads</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Conversion Rate</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {isStatsLoading ? '...' : `${conversionRate}%`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Closed vs Total leads ratio</p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pipeline Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Pipeline Stages</h2>
            <span className="text-xs text-slate-400">By Lead Status</span>
          </div>

          <div className="space-y-4">
            {(['NEW', 'CONTACTED', 'SITE_VISIT', 'CLOSED'] as LeadStatus[]).map((statusKey) => {
              const count = stats?.statusCounts?.[statusKey] || 0;
              const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              const info = statusLabels[statusKey];

              return (
                <div key={statusKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{info.label}</span>
                    <span className="text-slate-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${info.bg}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Lead Acquisition Sources</h2>
            <span className="text-xs text-slate-400">By Channel</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(sourceLabels) as LeadSource[]).map((src) => {
              const count = stats?.sourceCounts?.[src] || 0;
              return (
                <div key={src} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500">{sourceLabels[src]}</div>
                  <div className="text-lg font-bold text-slate-900">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Leads</h2>
            <p className="text-xs text-slate-400">Latest leads added to your CRM pipeline.</p>
          </div>
          <Link
            to="/leads"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {isRecentLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading recent leads...</div>
          ) : recentLeads.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Property</th>
                  <th className="py-3 px-6">Budget</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-semibold text-slate-900">{lead.name}</td>
                    <td className="py-3 px-6 text-slate-600">{lead.location}</td>
                    <td className="py-3 px-6 text-slate-600 flex items-center">
                      <Building className="w-3 h-3 text-slate-400 mr-1" />
                      {lead.propertyType.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-900">
                      {formatCurrency(Number(lead.budget))}
                    </td>
                    <td className="py-3 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent leads. Click "Manage All Leads" to create your first lead!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
