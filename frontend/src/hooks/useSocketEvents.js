import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useSocketEvents = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleLeadCreated = (lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(`New lead created: ${lead.name}`);
    };

    const handleLeadUpdated = (lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(`Lead updated: ${lead.name}`);
    };

    const handleLeadDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Lead deleted successfully');
    };

    socket.on('leadCreated', handleLeadCreated);
    socket.on('leadUpdated', handleLeadUpdated);
    socket.on('leadDeleted', handleLeadDeleted);

    return () => {
      socket.off('leadCreated', handleLeadCreated);
      socket.off('leadUpdated', handleLeadUpdated);
      socket.off('leadDeleted', handleLeadDeleted);
    };
  }, [socket, queryClient]);
};
