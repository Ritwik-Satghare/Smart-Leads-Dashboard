const ConfirmDialog = ({ isOpen, onClose, onConfirm, isLoading, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-6 shadow-float border border-outline-variant">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div>
            <h3 className="text-headline-md text-on-surface mb-1">{title || 'Confirm Action'}</h3>
            <p className="text-body-md text-on-surface-variant">{message || 'Are you sure? This action cannot be undone.'}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:bg-error/90 transition-colors disabled:opacity-70 flex items-center gap-2">
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" /> Deleting...</>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
