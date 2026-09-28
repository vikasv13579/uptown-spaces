import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import { leadApi, LeadStatus, LeadSource } from '../api/leadApi';

const statusConfig: Record<LeadStatus, { label: string; text: string; bg: string; barBg: string }> = {
  NEW: { label: 'New Inquiries', text: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', barBg: 'bg-sky-500' },
  CONTACTED: { label: 'Contacted / Pitching', text: 'text-amber-800', bg: 'bg-amber-50 border-amber-200', barBg: 'bg-amber-500' },
  SITE_VISIT: { label: 'Site Visit Scheduled', text: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', barBg: 'bg-indigo-500' },
  CLOSED: { label: 'Closed & Converted', text: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200', barBg: 'bg-emerald-600' },
};

const sourceLabels: Record<LeadSource, string> = {
  WEBSITE: 'Website Inquiries',
  GOOGLE: 'Google Search Ads',
  FACEBOOK: 'Meta Campaigns',
  REFERRAL: 'Direct Referrals',
  WALK_IN: 'Walk-In Visitors',
  OTHER: 'Offline & Others',
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
      {/* Header Summary Banner */}
      <div className="bg-navy-900 rounded-2xl p-6 text-white border border-navy-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold tracking-wide uppercase mb-2">
            <span>Executive Overview</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Uptown Spaces Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Real-time pipeline metrics, property inquiries summary, and sales conversion analytics.
          </p>
        </div>
        <Link
          to="/leads"
          className="self-start md:self-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-xs"
        >
          <span>Open Lead Directory</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline Leads */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <div className="p-2.5 bg-navy-900/5 text-navy-900 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isStatsLoading ? '...' : totalLeads}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total active entries in CRM</p>
          </div>
        </div>

        {/* Total Potential Budget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isStatsLoading ? '...' : formatCurrency(stats?.totalBudget || 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total combined lead budget</p>
          </div>
        </div>

        {/* Closed Deals */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Closed Deals</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isStatsLoading ? '...' : closedLeads}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Successfully booked properties</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Win Ratio</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isStatsLoading ? '...' : `${conversionRate}%`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Closed vs total lead ratio</p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stages */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Pipeline Breakdown</h2>
              <p className="text-xs text-slate-400">Current status distribution of buyers</p>
            </div>
            <CalendarCheck className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {(['NEW', 'CONTACTED', 'SITE_VISIT', 'CLOSED'] as LeadStatus[]).map((statusKey) => {
              const count = stats?.statusCounts?.[statusKey] || 0;
              const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              const info = statusConfig[statusKey];

              return (
                <div key={statusKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{info.label}</span>
                    <span className="text-slate-500 font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${info.barBg}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Acquisition Channels</h2>
              <p className="text-xs text-slate-400">Sources generating incoming property leads</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(sourceLabels) as LeadSource[]).map((src) => {
              const count = stats?.sourceCounts?.[src] || 0;
              return (
                <div key={src} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500">{sourceLabels[src]}</div>
                  <div className="text-base font-bold text-slate-900">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Property Inquiries</h2>
            <p className="text-xs text-slate-400">Latest buyers registered in the CRM system.</p>
          </div>
          <Link
            to="/leads"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {isRecentLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading recent leads...</div>
          ) : recentLeads.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-5">Buyer Name</th>
                  <th className="py-3 px-5">Target Location</th>
                  <th className="py-3 px-5">Property Type</th>
                  <th className="py-3 px-5">Budget</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => {
                  const statusInfo = statusConfig[lead.status];
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-5 font-semibold text-slate-900">{lead.name}</td>
                      <td className="py-3 px-5 text-slate-600">{lead.location}</td>
                      <td className="py-3 px-5 text-slate-600 inline-flex items-center gap-1.5 mt-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.propertyType.replace('_', ' ')}</span>
                      </td>
                      <td className="py-3 px-5 font-bold text-slate-900">
                        {formatCurrency(Number(lead.budget))}
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.bg} ${statusInfo.text}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent leads registered. Click "Open Lead Directory" to add your first client.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
