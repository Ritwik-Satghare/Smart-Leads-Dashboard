import api from './api';

export const leadsService = {
  async getAll(params = {}) {
    const res = await api.get('/leads', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/leads/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/leads', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/leads/${id}`, data);
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/leads/${id}`);
    return res.data;
  },
};
