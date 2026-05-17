import { Lead, ILead } from '../models/lead.model';
import { ICreateLeadRequest, IUpdateLeadRequest } from '../types/leads.types';
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

export const getAllLeads = async (caller: CallerContext): Promise<ILead[]> => {
  // Admin sees all leads; Sales Users see only their own
  const filter = caller.role === UserRole.ADMIN ? {} : { createdBy: caller.userId };
  return Lead.find(filter).sort({ createdAt: -1 });
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
