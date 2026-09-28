export type PropertyType =
  | 'ONE_BHK'
  | 'TWO_BHK'
  | 'THREE_BHK'
  | 'PLOT'
  | 'VILLA'
  | 'COMMERCIAL'
  | 'OTHER';

export type LeadSource =
  | 'FACEBOOK'
  | 'GOOGLE'
  | 'REFERRAL'
  | 'WEBSITE'
  | 'WALK_IN'
  | 'OTHER';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'SITE_VISIT' | 'CLOSED';

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: number | string;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  notes?: LeadNote[];
  _count?: {
    notes: number;
  };
}

export interface LeadStats {
  totalLeads: number;
  totalBudget: number;
  statusCounts: Record<LeadStatus, number>;
  sourceCounts: Record<LeadSource, number>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  propertyType?: PropertyType;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  email: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status?: LeadStatus;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}

const API_BASE = '/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (!response.ok || !json.success) {
    const errorMsg = json.message || 'API Request failed';
    throw new Error(errorMsg);
  }
  return json;
}

export const leadApi = {
  getLeads: async (filters?: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const res = await fetch(`${API_BASE}/leads?${params.toString()}`);
    return handleResponse<PaginatedResponse<Lead>>(res);
  },

  getLeadById: async (id: string): Promise<{ success: boolean; data: Lead }> => {
    const res = await fetch(`${API_BASE}/leads/${id}`);
    return handleResponse<{ success: boolean; data: Lead }>(res);
  },

  getLeadStats: async (): Promise<{ success: boolean; data: LeadStats }> => {
    const res = await fetch(`${API_BASE}/leads/stats`);
    return handleResponse<{ success: boolean; data: LeadStats }>(res);
  },

  createLead: async (input: CreateLeadInput): Promise<{ success: boolean; data: Lead }> => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<{ success: boolean; data: Lead }>(res);
  },

  updateLead: async (id: string, input: UpdateLeadInput): Promise<{ success: boolean; data: Lead }> => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<{ success: boolean; data: Lead }>(res);
  },

  deleteLead: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },

  addLeadNote: async (leadId: string, content: string): Promise<{ success: boolean; data: LeadNote }> => {
    const res = await fetch(`${API_BASE}/leads/${leadId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return handleResponse<{ success: boolean; data: LeadNote }>(res);
  },
};
