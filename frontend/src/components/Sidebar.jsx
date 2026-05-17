import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Leads', path: '/leads', icon: 'group' },
    { name: 'Analytics', path: '/analytics', icon: 'bar_chart' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col h-screen sticky top-0 left-0 w-64 px-4 py-8 hidden md:flex shrink-0 z-50">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
        </div>
        <div>
          <h1 className="text-headline-md font-headline-md font-bold text-primary">Smart Leads</h1>
          <p className="text-label-sm font-label-sm text-on-surface-variant">Premium CRM</p>
        </div>
      </div>
      
      <button className="bg-primary text-on-primary rounded-full py-3 px-4 flex items-center justify-center gap-2 mb-8 hover:bg-primary/90 transition-colors">
        <span className="material-symbols-outlined">add</span>
        <span className="text-label-md font-label-md">Add Lead</span>
      </button>

      <ul className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-low text-primary font-bold border-r-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  <span className="text-label-md font-label-md">{item.name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-outline-variant pt-4">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-label-md font-bold">
              {user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-label-md text-on-surface truncate">{user.name}</p>
              <p className="text-label-sm text-on-surface-variant capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <ul className="flex flex-col gap-2">
          <li>
            <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-all duration-200" href="#">
              <span className="material-symbols-outlined">help</span>
              <span className="text-label-md font-label-md">Help Center</span>
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-low transition-all duration-200"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-label-md font-label-md">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
