import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '../utils';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  public getOverview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await analyticsService.getOverview(req.user!.userId);
      sendResponse(res, 200, 'Analytics overview fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public getSources = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await analyticsService.getBySource(req.user!.userId);
      sendResponse(res, 200, 'Analytics sources fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public getStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await analyticsService.getByStatus(req.user!.userId);
      sendResponse(res, 200, 'Analytics status fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  public getMonthly = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await analyticsService.getMonthly(req.user!.userId);
      sendResponse(res, 200, 'Monthly analytics fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };
}
