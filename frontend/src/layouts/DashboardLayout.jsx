import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useSocketEvents } from '../hooks/useSocketEvents';

const DashboardLayout = () => {
  useSocketEvents();

  return (
    <div className="flex min-h-screen bg-surface dark:bg-dark-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
