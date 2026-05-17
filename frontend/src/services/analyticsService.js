import api from './api';

export const analyticsService = {
  async getOverview() {
    const res = await api.get('/analytics/overview');
    return res.data;
  },
  
  async getSources() {
    const res = await api.get('/analytics/sources');
    return res.data;
  },

  async getStatus() {
    const res = await api.get('/analytics/status');
    return res.data;
  },

  async getMonthly() {
    const res = await api.get('/analytics/monthly');
    return res.data;
  }
};
