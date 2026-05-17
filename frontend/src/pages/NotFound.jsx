import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-bg p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-card dark:bg-dark-card p-8 rounded-2xl shadow-card border border-border dark:border-dark-border">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h1 className="text-display-md text-text-primary dark:text-dark-text">404 - Page Not Found</h1>
        <p className="text-body text-text-secondary dark:text-dark-text-secondary">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-hover active:bg-primary-active transition-colors shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
