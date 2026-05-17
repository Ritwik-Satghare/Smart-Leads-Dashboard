import { z } from 'zod';
import { LeadStatus, LeadSource } from '../types/leads.types';

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource, {
    required_error: 'Source is required',
    invalid_type_error: 'Source must be one of: Website, Instagram, Referral',
  }),
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase()
    .optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided for update' }
);
