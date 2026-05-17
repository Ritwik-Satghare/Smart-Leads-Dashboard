import { useState, useRef, useEffect } from 'react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import LeadFormModal from '../components/LeadFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

const statusStyle = {
  New: 'bg-primary/10 text-primary',
  Contacted: 'bg-surface-variant text-on-surface-variant',
  Qualified: 'bg-secondary/10 text-secondary',
  Lost: 'bg-error/10 text-error',
};

const avatarColors = ['primary', 'secondary', 'tertiary', 'error'];

const Leads = () => {
  const { data: leads = [], isLoading, isError, error, refetch } = useLeads();

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);

  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Detail panel
  const [viewingLead, setViewingLead] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const createMutation = useCreateLead(() => setIsCreateOpen(false));
  const updateMutation = useUpdateLead(() => setEditingLead(null));
  const deleteMutation = useDeleteLead();

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data) => {
    if (!editingLead) return;
    updateMutation.mutate({ id: editingLead._id, data });
  };

  const handleDelete = () => {
    if (!deletingLead) return;
    deleteMutation.mutate(deletingLead._id, {
      onSuccess: () => setDeletingLead(null),
    });
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-background mb-1">Leads Management</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {leads.length > 0 ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} in your pipeline` : 'Track, filter, and manage your incoming leads pipeline.'}
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 text-on-primary text-label-md font-label-md py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Lead
        </button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-on-surface-variant text-body-md">Loading leads...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4">
          <span className="material-symbols-outlined text-error text-[48px] mb-4">error</span>
          <h3 className="text-headline-md text-on-surface mb-2">Something went wrong</h3>
          <p className="text-on-surface-variant text-body-md mb-4">{error?.message || 'Failed to fetch leads.'}</p>
          <button onClick={() => refetch()} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary/90 transition-colors">Retry</button>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4 hover:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4">group_off</span>
          <h3 className="text-headline-md text-on-surface mb-2">No leads found</h3>
          <p className="text-on-surface-variant text-body-md mb-4">You don't have any leads yet. Start by adding one.</p>
          <button onClick={() => setIsCreateOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary/90 transition-colors">Add First Lead</button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Source</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {leads.map((lead) => {
                  const color = getAvatarColor(lead.name);
                  return (
                    <tr key={lead._id} className="hover:bg-surface transition-colors group">
                      <td className="py-4 px-6">
                        <button onClick={() => setViewingLead(lead)} className="flex items-center gap-3 text-left hover:text-primary transition-colors">
                          <div className={`w-8 h-8 rounded-full bg-${color}/10 text-${color} flex items-center justify-center text-label-md font-bold flex-shrink-0`}>
                            {getInitials(lead.name)}
                          </div>
                          <span className="text-body-md text-on-surface font-medium">{lead.name}</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-body-md text-on-surface-variant hidden sm:table-cell">{lead.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm ${statusStyle[lead.status] || 'bg-surface-variant text-on-surface-variant'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-body-md text-on-surface-variant hidden md:table-cell">{lead.source}</td>
                      <td className="py-4 px-6 text-body-md text-on-surface-variant hidden lg:table-cell">{formatDate(lead.createdAt)}</td>
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === lead._id ? null : lead._id)}
                          className="text-outline hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                        {activeDropdown === lead._id && (
                          <div ref={dropdownRef} className="absolute right-6 top-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-30 min-w-[140px] py-1">
                            <button
                              onClick={() => { setViewingLead(lead); setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span> View
                            </button>
                            <button
                              onClick={() => { setEditingLead(lead); setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                            </button>
                            <button
                              onClick={() => { setDeletingLead(lead); setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-body-md text-error hover:bg-error/5 flex items-center gap-2 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-over */}
      {viewingLead && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-float border-l border-outline-variant overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-headline-md text-on-surface">Lead Details</h3>
              <button onClick={() => setViewingLead(null)} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-full bg-${getAvatarColor(viewingLead.name)}/10 text-${getAvatarColor(viewingLead.name)} flex items-center justify-center text-headline-md font-bold`}>
                {getInitials(viewingLead.name)}
              </div>
              <div>
                <p className="text-headline-md text-on-surface">{viewingLead.name}</p>
                <p className="text-body-md text-on-surface-variant">{viewingLead.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
                <span className="text-label-md text-on-surface-variant">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm ${statusStyle[viewingLead.status]}`}>
                  {viewingLead.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
                <span className="text-label-md text-on-surface-variant">Source</span>
                <span className="text-body-md text-on-surface">{viewingLead.source}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
                <span className="text-label-md text-on-surface-variant">Created</span>
                <span className="text-body-md text-on-surface">{formatDate(viewingLead.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-label-md text-on-surface-variant">Updated</span>
                <span className="text-body-md text-on-surface">{formatDate(viewingLead.updatedAt)}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-8 pt-6 border-t border-outline-variant">
              <button
                onClick={() => { setEditingLead(viewingLead); setViewingLead(null); }}
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span> Edit Lead
              </button>
              <button
                onClick={() => { setDeletingLead(viewingLead); setViewingLead(null); }}
                className="px-4 py-2.5 border border-error/30 text-error rounded-lg text-label-md hover:bg-error/5 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <LeadFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Modal */}
      <LeadFormModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
        initialData={editingLead}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Leads;
