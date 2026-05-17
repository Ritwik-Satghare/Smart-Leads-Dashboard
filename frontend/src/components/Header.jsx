import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 z-40">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-headline-md font-headline-md font-black text-primary hidden md:block">Smart Leads Dashboard</h2>
      </div>
      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative hidden sm:block max-w-md w-full mr-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
            placeholder="Search leads, tags, or companies..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low hidden sm:block">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <button className="bg-primary text-on-primary px-4 py-2 rounded-full text-label-md font-label-md hidden md:block hover:bg-primary/90 transition-colors shadow-sm">
          Invite Team
        </button>
        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden border border-outline-variant flex-shrink-0 flex items-center justify-center text-primary font-bold text-label-md">
          {user?.name?.substring(0, 2).toUpperCase() || '?'}
        </div>
      </div>
    </header>
  );
};

export default Header;
