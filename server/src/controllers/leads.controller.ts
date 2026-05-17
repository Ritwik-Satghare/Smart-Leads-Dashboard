import { Response, NextFunction } from 'express';
import * as leadsService from '../services/leads.service';
import { AuthenticatedRequest } from '../types';
import { sendResponse, UnauthorizedError, BadRequestError } from '../utils';

const getCaller = (req: AuthenticatedRequest) => {
  if (!req.user) throw new UnauthorizedError();
  return { userId: req.user.userId, role: req.user.role };
};

const getParamId = (req: AuthenticatedRequest): string => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) throw new BadRequestError('Invalid lead ID');
  return id;
};

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await leadsService.createLead(req.body, getCaller(req));
    sendResponse(res, 201, 'Lead created successfully', lead);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leads, total } = await leadsService.getAllLeads(getCaller(req), req.query);
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    
    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      data: leads,
      pagination: {
        page,
        limit,
        totalResults: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await leadsService.getLeadById(getParamId(req), getCaller(req));
    sendResponse(res, 200, 'Lead fetched successfully', lead);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await leadsService.updateLead(getParamId(req), req.body, getCaller(req));
    sendResponse(res, 200, 'Lead updated successfully', lead);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await leadsService.deleteLead(getParamId(req), getCaller(req));
    sendResponse(res, 200, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const caller = getCaller(req);
    // Use a very high limit to fetch all matching leads
    const query = { ...req.query, page: 1, limit: 100000 };
    const { leads } = await leadsService.getAllLeads(caller, query as any);

    const escapeField = (field: string): string => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const header = 'Name,Email,Status,Source,Created At';
    const rows = leads.map((lead) => {
      const createdAt = new Date(lead.createdAt).toISOString();
      return [
        escapeField(lead.name),
        escapeField(lead.email),
        escapeField(lead.status),
        escapeField(lead.source),
        escapeField(createdAt),
      ].join(',');
    });

    const csv = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
