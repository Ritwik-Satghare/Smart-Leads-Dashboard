import { Lead, ILead } from '../models/lead.model';
import { ICreateLeadRequest, IUpdateLeadRequest, ILeadQuery } from '../types/leads.types';
import { UserRole } from '../types';
import { NotFoundError, ForbiddenError } from '../utils';

interface CallerContext {
  userId: string;
  role: UserRole;
}

export const createLead = async (
  data: ICreateLeadRequest,
  caller: CallerContext
): Promise<ILead> => {
  const lead = await Lead.create({
    ...data,
    createdBy: caller.userId,
  });
  return lead;
};

export const getAllLeads = async (
  caller: CallerContext,
  query: ILeadQuery
): Promise<{ leads: ILead[]; total: number }> => {
  const { page = 1, limit = 10, status, source, search, sort = 'latest' } = query;
  
  // Build filter object
  const filter: Record<string, any> = {};
  
  // Role-based filter
  if (caller.role !== UserRole.ADMIN) {
    filter.createdBy = caller.userId;
  }
  
  // Query filters
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Sorting
  const sortStage = sort === 'oldest' ? { createdAt: 1 as const } : { createdAt: -1 as const };
  
  // Execute query
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sortStage).skip(skip).limit(Number(limit)),
    Lead.countDocuments(filter),
  ]);
  
  return { leads, total };
};

export const getLeadById = async (
  leadId: string,
  caller: CallerContext
): Promise<ILead> => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  // Sales Users can only view their own leads
  if (caller.role !== UserRole.ADMIN && String(lead.createdBy) !== caller.userId) {
    throw new ForbiddenError('You do not have access to this lead');
  }

  return lead;
};

export const updateLead = async (
  leadId: string,
  data: IUpdateLeadRequest,
  caller: CallerContext
): Promise<ILead> => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  if (caller.role !== UserRole.ADMIN && String(lead.createdBy) !== caller.userId) {
    throw new ForbiddenError('You do not have permission to edit this lead');
  }

  Object.assign(lead, data);
  await lead.save();
  return lead;
};

export const deleteLead = async (
  leadId: string,
  caller: CallerContext
): Promise<void> => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  if (caller.role !== UserRole.ADMIN && String(lead.createdBy) !== caller.userId) {
    throw new ForbiddenError('You do not have permission to delete this lead');
  }

  await lead.deleteOne();
};
