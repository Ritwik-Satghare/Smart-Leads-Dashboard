import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import LeadFormModal from '../components/LeadFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusStyle = {
  New:       'bg-info/10 text-info dark:bg-info/20',
  Contacted: 'bg-warning/10 text-warning dark:bg-warning/20',
  Qualified: 'bg-success/10 text-success dark:bg-success/20',
  Lost:      'bg-danger/10 text-danger dark:bg-danger/20',
};

const avatarColors = ['primary', 'info', 'warning', 'danger', 'purple', 'pink'];
const avatarBgMap = {
  primary: 'bg-primary/15 text-primary',
  info:    'bg-info/15 text-info',
  warning: 'bg-warning/15 text-warning',
  danger:  'bg-danger/15 text-danger',
  purple:  'bg-purple-500/15 text-purple-500',
  pink:    'bg-pink-500/15 text-pink-500',
};

const Leads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    page:   parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    source: searchParams.get('source') || '',
    sort:   searchParams.get('sort') || 'latest',
  };

  const [searchInput, setSearchInput] = useState(filters.search);
  const [isExporting, setIsExporting] = useState(false);

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
      if (key !== 'page') prev.set('page', '1');
      return prev;
    });
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const { data: response, isLoading, isError, error, refetch, isFetching } = useLeads({
    page: filters.page,
    limit: 10,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    ...(filters.source && { source: filters.source }),
    ...(filters.sort && { sort: filters.sort }),
  });

  const leads      = response?.data || [];
  const pagination = response?.pagination || { page: 1, totalPages: 1, totalResults: 0 };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead]   = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewingLead, setViewingLead]   = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
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
    if (deletingLead) deleteMutation.mutate(deletingLead._id, { onSuccess: () => setDeletingLead(null) });
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.sort)   params.sort   = filters.sort;

      const res = await api.get('/leads/export/csv', { params, responseType: 'blob' });
      const blob  = new Blob([res.data], { type: 'text/csv' });
      const url   = window.URL.createObjectURL(blob);
      const link  = document.createElement('a');
      link.href   = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
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
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-heading text-text-primary dark:text-dark-text">Leads Management</h1>
          <p className="text-body text-text-secondary dark:text-dark-text-secondary mt-0.5">
            {pagination.totalResults} lead{pagination.totalResults !== 1 ? 's' : ''} in your pipeline
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCsv}
            disabled={isExporting || leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-body font-medium rounded-lg border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white text-body font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap flex-1 md:flex-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border p-3 mb-5 flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-surface dark:bg-dark-elevated pl-9 pr-4 py-2 rounded-lg border border-border dark:border-dark-border text-body text-text-primary dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="bg-surface dark:bg-dark-elevated border border-border dark:border-dark-border rounded-lg py-2 px-3 text-body text-text-primary dark:text-dark-text focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select value={filters.source} onChange={(e) => handleFilterChange('source', e.target.value)} className="bg-surface dark:bg-dark-elevated border border-border dark:border-dark-border rounded-lg py-2 px-3 text-body text-text-primary dark:text-dark-text focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="bg-surface dark:bg-dark-elevated border border-border dark:border-dark-border rounded-lg py-2 px-3 text-body text-text-primary dark:text-dark-text focus:outline-none focus:border-primary flex-1 lg:flex-none">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          {isFiltering && (
            <button onClick={resetFilters} className="text-danger hover:bg-danger/10 text-body py-2 px-3 rounded-lg transition-colors flex items-center gap-1 flex-1 lg:flex-none justify-center">
              <span className="material-symbols-outlined text-[16px]">close</span> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="bg-surface-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border p-5 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 rounded w-1/4" />
                <div className="skeleton h-2.5 rounded w-1/3" />
              </div>
              <div className="skeleton w-16 h-5 rounded-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border text-center px-4">
          <span className="material-symbols-outlined text-danger text-[40px] mb-3">error</span>
          <h3 className="text-subhead text-text-primary dark:text-dark-text mb-2">Something went wrong</h3>
          <p className="text-body text-text-secondary dark:text-dark-text-secondary mb-4">{error?.message || 'Failed to fetch leads.'}</p>
          <button onClick={() => refetch()} className="bg-primary text-white px-4 py-2 rounded-lg text-body font-medium hover:bg-primary-hover transition-colors">Retry</button>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border text-center px-4">
          <span className="material-symbols-outlined text-text-muted dark:text-dark-text-muted text-[40px] mb-3">group_off</span>
          <h3 className="text-subhead text-text-primary dark:text-dark-text mb-2">{isFiltering ? 'No matches found' : 'No leads yet'}</h3>
          <p className="text-body text-text-secondary dark:text-dark-text-secondary mb-4">
            {isFiltering ? 'Try adjusting your filters.' : "Start by adding your first lead."}
          </p>
          {isFiltering ? (
            <button onClick={resetFilters} className="bg-surface dark:bg-dark-elevated border border-border dark:border-dark-border text-text-primary dark:text-dark-text px-4 py-2 rounded-lg text-body font-medium hover:bg-border/30 transition-colors">Clear Filters</button>
          ) : (
            <button onClick={() => setIsCreateOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg text-body font-medium hover:bg-primary-hover transition-colors">Add First Lead</button>
          )}
        </div>
      ) : (
        <div className="bg-surface-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border overflow-hidden relative">
          {isFetching && !isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30 overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/3 animate-shimmer"></div>
            </div>
          )}
          <div className="overflow-x-auto min-h-[300px] pb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface dark:bg-dark-elevated border-b border-border dark:border-dark-border">
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider">Name</th>
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider">Status</th>
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider hidden md:table-cell">Source</th>
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="py-3 px-5 text-overline text-text-muted dark:text-dark-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-dark-border">
                {leads.map((lead) => {
                  const color = getAvatarColor(lead.name);
                  return (
                    <tr key={lead._id} className="hover:bg-surface dark:hover:bg-dark-elevated transition-colors group">
                      <td className="py-3 px-5">
                        <button onClick={() => setViewingLead(lead)} className="flex items-center gap-3 text-left hover:text-primary transition-colors focus:outline-none">
                          <div className={`w-8 h-8 rounded-full ${avatarBgMap[color]} flex items-center justify-center text-caption font-bold flex-shrink-0`}>
                            {getInitials(lead.name)}
                          </div>
                          <span className="text-body text-text-primary dark:text-dark-text font-medium">{lead.name}</span>
                        </button>
                      </td>
                      <td className="py-3 px-5 text-body text-text-secondary dark:text-dark-text-secondary hidden sm:table-cell">{lead.email}</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-caption font-semibold ${statusStyle[lead.status] || 'bg-surface text-text-secondary'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-body text-text-secondary dark:text-dark-text-secondary hidden md:table-cell">{lead.source}</td>
                      <td className="py-3 px-5 text-body text-text-secondary dark:text-dark-text-secondary hidden lg:table-cell">{formatDate(lead.createdAt)}</td>
                      <td className="py-3 px-5 text-right relative">
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === lead._id ? null : lead._id);
                          }}
                          className="text-text-muted dark:text-dark-text-muted hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                        {activeDropdown === lead._id && (
                          <div ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()} className="absolute right-5 top-full mt-1 bg-surface-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-modal z-50 min-w-[140px] py-1 animate-scale-in">
                            <button onClick={() => { setViewingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 text-body text-text-primary dark:text-dark-text hover:bg-surface dark:hover:bg-dark-elevated flex items-center gap-2 transition-colors">
                              <span className="material-symbols-outlined text-[16px]">visibility</span> View
                            </button>
                            <button onClick={() => { setEditingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 text-body text-text-primary dark:text-dark-text hover:bg-surface dark:hover:bg-dark-elevated flex items-center gap-2 transition-colors">
                              <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                            </button>
                            <button onClick={() => { setDeletingLead(lead); setActiveDropdown(null); }} className="w-full text-left px-3 py-2 text-body text-danger hover:bg-danger/5 flex items-center gap-2 transition-colors">
                              <span className="material-symbols-outlined text-[16px]">delete</span> Delete
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-border dark:border-dark-border bg-surface-card dark:bg-dark-card px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-body text-text-secondary dark:text-dark-text-secondary">
                Showing <span className="font-medium text-text-primary dark:text-dark-text">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-text-primary dark:text-dark-text">{Math.min(pagination.page * pagination.limit, pagination.totalResults)}</span> of <span className="font-medium text-text-primary dark:text-dark-text">{pagination.totalResults}</span>
              </span>
              <div className="flex gap-1.5">
                <button disabled={pagination.page <= 1} onClick={() => handleFilterChange('page', String(pagination.page - 1))} className="p-2 border border-border dark:border-dark-border rounded-lg text-text-primary dark:text-dark-text hover:bg-surface dark:hover:bg-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div className="flex items-center px-3">
                  <span className="text-body text-text-primary dark:text-dark-text font-medium">{pagination.page} / {pagination.totalPages}</span>
                </div>
                <button disabled={pagination.page >= pagination.totalPages} onClick={() => handleFilterChange('page', String(pagination.page + 1))} className="p-2 border border-border dark:border-dark-border rounded-lg text-text-primary dark:text-dark-text hover:bg-surface dark:hover:bg-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Detail */}
      {viewingLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in" onClick={() => setViewingLead(null)}>
          <div className="bg-surface-card dark:bg-dark-card w-full max-w-md h-full shadow-float border-l border-border dark:border-dark-border overflow-y-auto p-6 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-subhead text-text-primary dark:text-dark-text">Lead Details</h3>
              <button onClick={() => setViewingLead(null)} className="p-2 rounded-lg hover:bg-surface dark:hover:bg-dark-elevated text-text-muted dark:text-dark-text-muted transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full ${avatarBgMap[getAvatarColor(viewingLead.name)]} flex items-center justify-center text-subhead font-bold`}>
                {getInitials(viewingLead.name)}
              </div>
              <div>
                <p className="text-subhead text-text-primary dark:text-dark-text">{viewingLead.name}</p>
                <p className="text-body text-text-secondary dark:text-dark-text-secondary">{viewingLead.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                ['Status', <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-caption font-semibold ${statusStyle[viewingLead.status]}`}>{viewingLead.status}</span>],
                ['Source', <span className="text-body text-text-primary dark:text-dark-text">{viewingLead.source}</span>],
                ['Created', <span className="text-body text-text-primary dark:text-dark-text">{formatDate(viewingLead.createdAt)}</span>],
                ['Updated', <span className="text-body text-text-primary dark:text-dark-text">{formatDate(viewingLead.updatedAt)}</span>],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border/50 dark:border-dark-border/50 last:border-0">
                  <span className="text-body font-medium text-text-muted dark:text-dark-text-muted">{label}</span>
                  {value}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-border dark:border-dark-border">
              <button onClick={() => { setEditingLead(viewingLead); setViewingLead(null); }} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-body font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">edit</span> Edit
              </button>
              <button onClick={() => { setDeletingLead(viewingLead); setViewingLead(null); }} className="px-4 py-2.5 border border-danger/30 text-danger rounded-lg text-body font-medium hover:bg-danger/5 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} isSubmitting={createMutation.isPending} />
      <LeadFormModal isOpen={!!editingLead} onClose={() => setEditingLead(null)} onSubmit={handleUpdate} isSubmitting={updateMutation.isPending} initialData={editingLead} />
      <ConfirmDialog isOpen={!!deletingLead} onClose={() => setDeletingLead(null)} onConfirm={handleDelete} isLoading={deleteMutation.isPending} title="Delete Lead" message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`} />
    </div>
  );
};

export default Leads;
