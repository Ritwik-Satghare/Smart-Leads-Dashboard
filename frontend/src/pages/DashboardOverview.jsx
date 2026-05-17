import { useQueries } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/* ─── Skeletons ─── */
const StatCardSkeleton = () => (
  <div className="bg-surface-card dark:bg-dark-card rounded-xl p-5 border border-border dark:border-dark-border animate-fade-in">
    <div className="flex justify-between items-start mb-3">
      <div className="skeleton w-10 h-10 rounded-lg" />
      <div className="skeleton w-16 h-5 rounded" />
    </div>
    <div className="skeleton h-3 w-20 rounded mb-2" />
    <div className="skeleton h-8 w-12 rounded" />
  </div>
);

const ChartSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8">
    <div className="skeleton w-full h-full rounded-lg min-h-[200px]" />
  </div>
);

const EmptyState = ({ message, icon = 'analytics' }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted dark:text-dark-text-muted p-8">
    <span className="material-symbols-outlined text-[40px] mb-3 opacity-40">{icon}</span>
    <p className="text-body text-center">{message}</p>
    <p className="text-caption text-center mt-1 opacity-60">Add some leads to see insights here</p>
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ icon, iconBg, iconColor, label, value, subtitle }) => (
  <div className="bg-surface-card dark:bg-dark-card rounded-xl p-5 border border-border dark:border-dark-border hover:shadow-card-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-3">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
        <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>{icon}</span>
      </div>
      {subtitle && (
        <span className="text-caption text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
          {subtitle}
        </span>
      )}
    </div>
    <p className="text-caption text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">{label}</p>
    <p className="text-[28px] font-bold text-text-primary dark:text-dark-text leading-none">{value}</p>
  </div>
);

const DashboardOverview = () => {
  const { isDark } = useTheme();

  const [
    { data: overviewData, isLoading: isLoadingOverview, isError: isErrorOverview },
    { data: sourcesData, isLoading: isLoadingSources, isError: isErrorSources },
    { data: statusData, isLoading: isLoadingStatus, isError: isErrorStatus },
    { data: monthlyData, isLoading: isLoadingMonthly, isError: isErrorMonthly }
  ] = useQueries({
    queries: [
      { queryKey: ['analytics', 'overview'], queryFn: analyticsService.getOverview },
      { queryKey: ['analytics', 'sources'], queryFn: analyticsService.getSources },
      { queryKey: ['analytics', 'status'], queryFn: analyticsService.getStatus },
      { queryKey: ['analytics', 'monthly'], queryFn: analyticsService.getMonthly }
    ]
  });

  const overview = overviewData?.data || { total: 0, qualified: 0, lost: 0, conversionRate: 0 };
  const sources = sourcesData?.data || [];
  const statuses = statusData?.data || [];
  const monthly = monthlyData?.data || [];

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: textColor,
    borderRadius: '12px',
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-heading text-text-primary dark:text-dark-text">Dashboard</h1>
            <p className="text-body text-text-secondary dark:text-dark-text-secondary mt-0.5">
              Real-time aggregated data from your lead pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-caption text-primary font-medium">Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingOverview ? (
          <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
        ) : isErrorOverview ? (
          <div className="col-span-full bg-danger-light dark:bg-danger/10 text-danger p-4 rounded-xl border border-danger/20 text-body">
            Failed to load metrics. Please try again.
          </div>
        ) : (
          <>
            <StatCard icon="groups" iconBg="bg-primary/10" iconColor="text-primary" label="Total Leads" value={overview.total} subtitle="↗ Live Database" />
            <StatCard icon="verified" iconBg="bg-info/10" iconColor="text-info" label="Qualified" value={overview.qualified} subtitle="↗ Active" />
            <StatCard icon="cancel" iconBg="bg-danger/10" iconColor="text-danger" label="Lost Leads" value={overview.lost} />
            <StatCard icon="trending_up" iconBg="bg-warning/10" iconColor="text-warning" label="Conversion Rate" value={`${overview.conversionRate}%`} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Status Bar Chart */}
        <div className="bg-surface-card dark:bg-dark-card rounded-xl p-5 border border-border dark:border-dark-border min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-subhead text-text-primary dark:text-dark-text">Leads by Status</h3>
          </div>
          <div className="h-[320px] w-full relative">
            {isLoadingStatus ? <ChartSkeleton /> : isErrorStatus ? <EmptyState message="Failed to load status data" /> : statuses.length === 0 ? <EmptyState message="No data available" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statuses} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} stroke={textColor} />
                  <YAxis tickLine={false} axisLine={false} stroke={textColor} />
                  <Tooltip cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {statuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Source Pie Chart */}
        <div className="bg-surface-card dark:bg-dark-card rounded-xl p-5 border border-border dark:border-dark-border min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-subhead text-text-primary dark:text-dark-text">Leads by Source</h3>
          </div>
          <div className="h-[320px] w-full relative">
            {isLoadingSources ? <ChartSkeleton /> : isErrorSources ? <EmptyState message="Failed to load sources data" /> : sources.length === 0 ? <EmptyState message="No data available" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="source"
                    label={({ source, name, percent }) => `${source || name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: textColor }}
                  >
                    {sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Line Chart */}
      <div className="bg-surface-card dark:bg-dark-card rounded-xl p-5 border border-border dark:border-dark-border min-h-[400px] flex flex-col mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-subhead text-text-primary dark:text-dark-text">Monthly Leads (This Year)</h3>
        </div>
        <div className="h-[320px] w-full relative">
          {isLoadingMonthly ? <ChartSkeleton /> : isErrorMonthly ? <EmptyState message="Failed to load monthly data" /> : monthly.length === 0 ? <EmptyState message="No data available" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke={textColor} />
                <YAxis tickLine={false} axisLine={false} stroke={textColor} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
