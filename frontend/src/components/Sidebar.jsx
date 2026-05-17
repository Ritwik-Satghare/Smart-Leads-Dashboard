import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
    { name: 'Leads', path: '/leads', icon: 'groups' },
    { name: 'Settings', path: '/settings', icon: 'tune' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-sidebar flex flex-col h-screen sticky top-0 left-0 w-[260px] py-6 hidden md:flex shrink-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-5">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        <div>
          <h1 className="text-[17px] font-bold text-white leading-tight">
            Smart<span className="text-primary">Leads</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <ul className="flex flex-col gap-1 flex-grow px-3">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto px-3 pt-4 border-t border-white/10 mx-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-caption font-bold flex-shrink-0">
              {user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white font-medium truncate">{user.name}</p>
              <p className="text-[11px] text-sidebar-text capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors"
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
