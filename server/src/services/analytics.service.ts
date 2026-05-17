import mongoose from 'mongoose';
import { Lead } from '../models/lead.model';
import { LeadStatus } from '../types/leads.types';

export class AnalyticsService {
  public async getOverview(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    
    const stats = await Lead.aggregate([
      { $match: { createdBy: objectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          qualified: {
            $sum: { $cond: [{ $eq: ['$status', LeadStatus.QUALIFIED] }, 1, 0] }
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', LeadStatus.LOST] }, 1, 0] }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return { total: 0, qualified: 0, lost: 0, conversionRate: 0 };
    }

    const { total, qualified, lost } = stats[0];
    const conversionRate = total > 0 ? Number(((qualified / total) * 100).toFixed(2)) : 0;

    return { total, qualified, lost, conversionRate };
  }

  public async getBySource(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    
    return Lead.aggregate([
      { $match: { createdBy: objectId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          source: '$_id',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  public async getByStatus(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    
    return Lead.aggregate([
      { $match: { createdBy: objectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  public async getMonthly(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    
    const monthlyStats = await Lead.aggregate([
      { 
        $match: { 
          createdBy: objectId,
          createdAt: { $gte: startOfYear }
        } 
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = months.map((month, index) => {
      const monthData = monthlyStats.find(stat => stat._id.month === index + 1);
      return {
        month,
        count: monthData ? monthData.count : 0
      };
    });

    return formattedData;
  }
}
