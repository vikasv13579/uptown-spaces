import { z } from 'zod';
import { PropertyType, LeadSource, LeadStatus } from '../types/enums.js';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(8, 'Phone number must be at least 8 digits'),
    email: z.string().email('Invalid email address'),
    budget: z.number().positive('Budget must be positive').or(
      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid budget value').transform(val => parseFloat(val))
    ),
    location: z.string().min(2, 'Location is required'),
    propertyType: z.nativeEnum(PropertyType, {
      errorMap: () => ({ message: 'Invalid property type' }),
    }),
    source: z.nativeEnum(LeadSource, {
      errorMap: () => ({ message: 'Invalid lead source' }),
    }),
    status: z.nativeEnum(LeadStatus, {
      errorMap: () => ({ message: 'Invalid lead status' }),
    }).optional().default(LeadStatus.NEW),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(8, 'Phone number must be at least 8 digits').optional(),
    email: z.string().email('Invalid email address').optional(),
    budget: z.number().positive('Budget must be positive').or(
      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid budget value').transform(val => parseFloat(val))
    ).optional(),
    location: z.string().min(2, 'Location is required').optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    status: z.nativeEnum(LeadStatus).optional(),
  }),
});

export const getLeadByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
});

export const deleteLeadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
});

export const createNoteSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
  body: z.object({
    content: z.string().min(1, 'Note content cannot be empty'),
  }),
});

export const getLeadsQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    search: z.string().optional(),
    minBudget: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxBudget: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    sortBy: z.enum(['createdAt', 'name', 'budget', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().optional().default('1').transform(val => parseInt(val, 10)),
    limit: z.string().optional().default('10').transform(val => parseInt(val, 10)),
  }),
});
