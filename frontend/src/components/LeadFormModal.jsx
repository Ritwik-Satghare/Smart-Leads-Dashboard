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
    defaultValues: {
      name: '',
      email: '',
      source: '',
      status: 'New',
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        source: initialData.source || '',
        status: initialData.status || 'New',
      });
    } else if (isOpen) {
      reset({ name: '', email: '', source: '', status: 'New' });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const fieldClass = (hasError) =>
    `w-full bg-surface-container-lowest border ${hasError ? 'border-error' : 'border-outline-variant'} rounded-lg py-2.5 px-3 text-body-md focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-primary/20 focus:border-primary'} transition-all`;

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-float border border-outline-variant animate-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-headline-md text-on-surface">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={handleClose} className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-label-md text-on-surface mb-1.5">Full Name</label>
            <input {...register('name')} type="text" className={fieldClass(errors.name)} placeholder="John Doe" />
            {errors.name && <p className="text-error text-label-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-label-md text-on-surface mb-1.5">Email Address</label>
            <input {...register('email')} type="email" className={fieldClass(errors.email)} placeholder="john@example.com" />
            {errors.email && <p className="text-error text-label-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-label-md text-on-surface mb-1.5">Source</label>
            <select {...register('source')} className={fieldClass(errors.source)}>
              <option value="">Select Source...</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Instagram">Instagram</option>
            </select>
            {errors.source && <p className="text-error text-label-sm mt-1">{errors.source.message}</p>}
          </div>

          {isEditing && (
            <div>
              <label className="block text-label-md text-on-surface mb-1.5">Status</label>
              <select {...register('status')} className={fieldClass(errors.status)}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2">
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> {isEditing ? 'Updating...' : 'Saving...'}</>
              ) : isEditing ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
