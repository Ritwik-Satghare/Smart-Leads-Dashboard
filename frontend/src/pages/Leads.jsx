import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL
  const filters = {
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    source: searchParams.get('source') || '',
    sort: searchParams.get('sort') || 'latest',
  };

  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setSearchParams((prev) => {
          if (searchInput) prev.set('search', searchInput);
          else prev.delete('search');
          prev.set('page', '1');
          return prev;
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      if (key !== 'page') prev.set('page', '1'); // Reset to page 1 on filter change
      return prev;
    });
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  // Fetch leads
  const { data: response, isLoading, isError, error, refetch, isFetching } = useLeads({
    page: filters.page,
    limit: 10,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    ...(filters.source && { source: filters.source }),
    ...(filters.sort && { sort: filters.sort }),
  });

  const leads = response?.data || [];
  const pagination = response?.pagination || { page: 1, totalPages: 1, totalResults: 0 };

  // Modal and Dropdown states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const dropdownRef = useRef(null);

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

  const handleCreate = (data) => createMutation.mutate(data);
  const handleUpdate = (data) => { if (editingLead) updateMutation.mutate({ id: editingLead._id, data }); };
  const handleDelete = () => {
    if (deletingLead) {
      deleteMutation.mutate(deletingLead._id, { onSuccess: () => setDeletingLead(null) });
    }
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isFiltering = filters.search || filters.status || filters.source || filters.sort !== 'latest';

  return (
    <div className="max-w-[1440px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-background mb-1">Leads Management</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {pagination.totalResults} lead{pagination.totalResults !== 1 ? 's' : ''} in your pipeline
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 text-on-primary text-label-md font-label-md py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap w-full md:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Lead
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-surface pl-10 pr-4 py-2 rounded-lg border border-outline-variant text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select value={filters.source} onChange={(e) => handleFilterChange('source', e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="bg-surface border border-outline-variant rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
          {isFiltering && (
            <button onClick={resetFilters} className="text-error hover:bg-error/10 text-label-md py-2 px-3 rounded-lg transition-colors flex items-center gap-1 flex-1 lg:flex-none justify-center">
              <span className="material-symbols-outlined text-[18px]">close</span> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-variant/30"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-variant/30 rounded w-1/4"></div>
                <div className="h-3 bg-surface-variant/30 rounded w-1/3"></div>
              </div>
              <div className="w-24 h-6 rounded-full bg-surface-variant/30"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4">
          <span className="material-symbols-outlined text-error text-[48px] mb-4">error</span>
          <h3 className="text-headline-md text-on-surface mb-2">Something went wrong</h3>
          <p className="text-on-surface-variant text-body-md mb-4">{error?.message || 'Failed to fetch leads.'}</p>
          <button onClick={() => refetch()} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary/90 transition-colors">Retry</button>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4">group_off</span>
          <h3 className="text-headline-md text-on-surface mb-2">{isFiltering ? 'No matches found' : 'No leads found'}</h3>
          <p className="text-on-surface-variant text-body-md mb-4">
            {isFiltering ? 'Try adjusting your filters or search query.' : "You don't have any leads yet. Start by adding one."}
          </p>
          {isFiltering ? (
            <button onClick={resetFilters} className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-lg text-label-md hover:bg-surface-container-low transition-colors">Clear Filters</button>
          ) : (
            <button onClick={() => setIsCreateOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary/90 transition-colors">Add First Lead</button>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden relative">
          {/* Overlay when refetching silently in background */}
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-surface-container-lowest/50 z-10 animate-pulse pointer-events-none" />
          )}
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
                        <button onClick={() => setViewingLead(lead)} className="flex items-center gap-3 text-left hover:text-primary transition-colors focus:outline-none">
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
                          className="text-outline hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                        {activeDropdown === lead._id && (
                          <div ref={dropdownRef} className="absolute right-6 top-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-30 min-w-[140px] py-1">
                            <button onClick={() => { setViewingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                              <span className="material-symbols-outlined text-[18px]">visibility</span> View
                            </button>
                            <button onClick={() => { setEditingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                              <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                            </button>
                            <button onClick={() => { setDeletingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-body-md text-error hover:bg-error/5 flex items-center gap-2 transition-colors">
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

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-outline-variant bg-surface-container-lowest px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-body-md text-on-surface-variant">
                Showing <span className="font-medium text-on-surface">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-on-surface">{Math.min(pagination.page * pagination.limit, pagination.totalResults)}</span> of <span className="font-medium text-on-surface">{pagination.totalResults}</span> results
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handleFilterChange('page', String(pagination.page - 1))}
                  className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <div className="flex gap-1 items-center px-2">
                  <span className="text-label-md text-on-surface">Page {pagination.page} of {pagination.totalPages}</span>
                </div>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handleFilterChange('page', String(pagination.page + 1))}
                  className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Detail view */}
      {viewingLead && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-float border-l border-outline-variant overflow-y-auto p-6 animate-in slide-in-from-right">
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
              <button onClick={() => { setEditingLead(viewingLead); setViewingLead(null); }} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">edit</span> Edit Lead
              </button>
              <button onClick={() => { setDeletingLead(viewingLead); setViewingLead(null); }} className="px-4 py-2.5 border border-error/30 text-error rounded-lg text-label-md hover:bg-error/5 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} isSubmitting={createMutation.isPending} />
      <LeadFormModal isOpen={!!editingLead} onClose={() => setEditingLead(null)} onSubmit={handleUpdate} isSubmitting={updateMutation.isPending} initialData={editingLead} />
      <ConfirmDialog isOpen={!!deletingLead} onClose={() => setDeletingLead(null)} onConfirm={handleDelete} isLoading={deleteMutation.isPending} title="Delete Lead" message={`Are you sure you want to delete "${deletingLead?.name}"?`} />
    </div>
  );
};

export default Leads;
