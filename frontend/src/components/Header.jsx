import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  return (
    <header className="bg-surface-card dark:bg-dark-card/80 backdrop-blur-md sticky top-0 border-b border-border dark:border-dark-border flex justify-between items-center w-full px-4 md:px-8 py-3 z-40">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block max-w-sm w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted text-[18px]">search</span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-surface dark:bg-dark-elevated border border-border dark:border-dark-border rounded-lg py-2 pl-9 pr-4 text-body text-text-primary dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="Search leads..."
            type="text"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-elevated transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="h-6 w-px bg-border dark:bg-dark-border mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-caption flex-shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || '?'}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-medium text-text-primary dark:text-dark-text leading-tight">{user?.name}</p>
            <p className="text-[11px] text-text-muted dark:text-dark-text-muted capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
