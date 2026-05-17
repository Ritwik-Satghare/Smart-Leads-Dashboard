const ConfirmDialog = ({ isOpen, onClose, onConfirm, isLoading, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-surface-card dark:bg-dark-card rounded-xl max-w-sm w-full p-6 shadow-modal border border-border dark:border-dark-border animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-danger text-[22px]">warning</span>
          </div>
          <div>
            <h3 className="text-subhead text-text-primary dark:text-dark-text mb-1">{title || 'Confirm Action'}</h3>
            <p className="text-body text-text-secondary dark:text-dark-text-secondary">{message || 'Are you sure? This action cannot be undone.'}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-dark-border">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-body font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-elevated rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-danger text-white rounded-lg text-body font-medium hover:bg-danger/90 transition-colors disabled:opacity-60 flex items-center gap-2">
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
