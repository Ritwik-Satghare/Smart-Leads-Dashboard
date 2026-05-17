import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().min(2, 'At least 2 characters').required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  source: yup.string().oneOf(['Website', 'Instagram', 'Referral'], 'Pick a valid source').required('Source is required'),
  status: yup.string().oneOf(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
}).required();

const LeadFormModal = ({ isOpen, onClose, onSubmit, isSubmitting, initialData = null }) => {
  const isEditing = !!initialData;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', source: '', status: 'New' },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({ name: initialData.name || '', email: initialData.email || '', source: initialData.source || '', status: initialData.status || 'New' });
    } else if (isOpen) {
      reset({ name: '', email: '', source: '', status: 'New' });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const handleClose = () => { reset(); onClose(); };

  const fieldClass = (hasError) =>
    `w-full bg-surface dark:bg-dark-elevated border ${hasError ? 'border-danger' : 'border-border dark:border-dark-border'} rounded-lg py-2.5 px-3 text-body text-text-primary dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-danger/20 focus:border-danger' : 'focus:ring-primary/20 focus:border-primary'} transition-all`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={handleClose}>
      <div className="bg-surface-card dark:bg-dark-card rounded-xl max-w-md w-full p-6 shadow-modal border border-border dark:border-dark-border animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-subhead text-text-primary dark:text-dark-text">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={handleClose} className="text-text-muted dark:text-dark-text-muted hover:bg-surface dark:hover:bg-dark-elevated p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Full Name</label>
            <input {...register('name')} type="text" className={fieldClass(errors.name)} placeholder="John Doe" />
            {errors.name && <p className="text-danger text-caption mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Email Address</label>
            <input {...register('email')} type="email" className={fieldClass(errors.email)} placeholder="john@example.com" />
            {errors.email && <p className="text-danger text-caption mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Source</label>
            <select {...register('source')} className={fieldClass(errors.source)}>
              <option value="">Select Source...</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Instagram">Instagram</option>
            </select>
            {errors.source && <p className="text-danger text-caption mt-1">{errors.source.message}</p>}
          </div>
          {isEditing && (
            <div>
              <label className="block text-body font-medium text-text-primary dark:text-dark-text mb-1.5">Status</label>
              <select {...register('status')} className={fieldClass(errors.status)}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-border dark:border-dark-border">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-body font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-elevated rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg text-body font-medium hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {isEditing ? 'Updating...' : 'Saving...'}</>
              ) : isEditing ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
