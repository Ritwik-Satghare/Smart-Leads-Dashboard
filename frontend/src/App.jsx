import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, GuestRoute } from './components/AuthGuard';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  className: '!bg-surface-card dark:!bg-dark-card !text-text-primary dark:!text-dark-text !border !border-border dark:!border-dark-border !rounded-lg !text-[13px] !shadow-card-lg',
                  success: {
                    iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                  },
                }}
              />
              <Routes>
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="settings" element={
                    <div className="max-w-[1400px] mx-auto">
                      <h1 className="text-heading text-text-primary dark:text-dark-text mb-2">Settings</h1>
                      <p className="text-body text-text-secondary dark:text-dark-text-secondary">Settings panel — coming soon.</p>
                    </div>
                  } />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
