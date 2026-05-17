import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../services/leadsService';
import toast from 'react-hot-toast';

const LEADS_KEY = ['leads'];

export const useLeads = () => {
  return useQuery({
    queryKey: LEADS_KEY,
    queryFn: async () => {
      const res = await leadsService.getAll();
      return res.data;
    },
    staleTime: 30 * 1000,
  });
};

export const useLead = (id) => {
  return useQuery({
    queryKey: [...LEADS_KEY, id],
    queryFn: async () => {
      const res = await leadsService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateLead = (onDone) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => leadsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead created');
      onDone?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = (onDone) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => leadsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead updated');
      onDone?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => leadsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead deleted');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete lead');
    },
  });
};
