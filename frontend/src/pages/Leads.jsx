import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  source: yup.string().required('Source is required'),
}).required();

const initialLeads = [
  { id: 1, name: 'Eleanor Shellstrop', email: 'eleanor@example.com', status: 'New', source: 'Website', date: 'Oct 24, 2023', initials: 'ES', color: 'primary' },
  { id: 2, name: 'Chidi Anagonye', email: 'chidi.a@university.edu', status: 'Qualified', source: 'Referral', date: 'Oct 23, 2023', initials: 'CA', color: 'secondary' },
  { id: 3, name: 'Tahani Al-Jamil', email: 'tahani@foundation.org', status: 'Contacted', source: 'Instagram', date: 'Oct 22, 2023', initials: 'TA', color: 'tertiary' },
];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // Simulate random error to show error handling UI sometimes (let's avoid random error to make it robust, or just a retry button)
        setLeads(initialLeads);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leads. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newLead = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      status: 'New',
      source: data.source,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      initials: data.name.substring(0, 2).toUpperCase(),
      color: 'primary'
    };

    setLeads([newLead, ...leads]);
    setIsSubmittingForm(false);
    setIsModalOpen(false);
    reset();
  };

  const clearAll = () => setLeads([]); // To demonstrate empty state

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-background mb-1">Leads Management</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Track, filter, and manage your incoming leads pipeline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative hidden md:block">
            <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-4 pr-10 text-label-md font-label-md text-on-surface hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer">
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-on-primary text-label-md font-label-md py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Lead
          </button>
          <button onClick={clearAll} className="bg-surface-variant text-on-surface-variant text-label-md font-label-md py-2 px-4 rounded-lg transition-colors">
            Clear Leads (Test Empty)
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-on-surface-variant text-body-md">Loading leads...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4">
          <span className="material-symbols-outlined text-error text-[48px] mb-4">error</span>
          <h3 className="text-headline-md text-on-surface mb-2">Something went wrong</h3>
          <p className="text-on-surface-variant text-body-md mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-on-primary px-4 py-2 rounded-lg">Retry</button>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-surface-container-lowest rounded-xl border border-outline-variant text-center px-4 hover:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4">group_off</span>
          <h3 className="text-headline-md text-on-surface mb-2">No leads found</h3>
          <p className="text-on-surface-variant text-body-md mb-4">You don't have any leads yet. Start by adding one.</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md">Add First Lead</button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Source</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Created At</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-surface transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${lead.color}-container text-on-${lead.color}-container flex items-center justify-center text-label-md font-bold`}>
                          {lead.initials}
                        </div>
                        <span className="text-body-md font-body-md text-on-surface font-medium">{lead.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-md font-body-md text-on-surface-variant">{lead.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm ${
                        lead.status === 'New' ? 'bg-primary/10 text-primary' : 
                        lead.status === 'Qualified' ? 'bg-secondary/10 text-secondary' : 
                        lead.status === 'Lost' ? 'bg-error/10 text-error' : 'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-body-md font-body-md text-on-surface-variant">{lead.source}</td>
                    <td className="py-4 px-6 text-body-md font-body-md text-on-surface-variant">{lead.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-outline hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-float border border-outline-variant transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-md text-on-surface">Add New Lead</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }} className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-label-md text-on-surface mb-1">Full Name</label>
                <input 
                  {...register('name')}
                  type="text" 
                  className={`w-full bg-surface border ${errors.name ? 'border-error' : 'border-outline-variant'} rounded-lg py-2 px-3 text-body-md focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-error text-label-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-label-md text-on-surface mb-1">Email Address</label>
                <input 
                  {...register('email')}
                  type="email" 
                  className={`w-full bg-surface border ${errors.email ? 'border-error' : 'border-outline-variant'} rounded-lg py-2 px-3 text-body-md focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-error text-label-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-label-md text-on-surface mb-1">Source</label>
                <select 
                  {...register('source')}
                  className={`w-full bg-surface border ${errors.source ? 'border-error' : 'border-outline-variant'} rounded-lg py-2 px-3 text-body-md focus:outline-none focus:ring-2 ${errors.source ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'}`}
                >
                  <option value="">Select Source...</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
                {errors.source && <p className="text-error text-label-sm mt-1">{errors.source.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
                <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingForm} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2">
                  {isSubmittingForm ? (
                    <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div> Saving...</>
                  ) : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
