import { useQueries } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#006a61', '#ba1a1a', '#eab308', '#ec4899', '#8b5cf6'];

const StatCardSkeleton = () => (
  <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col h-32 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-surface-variant mb-4"></div>
    <div className="h-4 bg-surface-variant rounded w-24 mb-2"></div>
    <div className="h-8 bg-surface-variant rounded w-16"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="w-full h-full bg-surface-variant/20 rounded animate-pulse"></div>
);

const EmptyState = ({ message }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant p-8">
    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">analytics</span>
    <p>{message}</p>
  </div>
);

const DashboardOverview = () => {
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

  return (
    <div className="max-w-container-max mx-auto">
      <div className="mb-8">
        <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">Analytics Dashboard</h3>
        <p className="text-body-md font-body-md text-on-surface-variant">Real-time metrics and lead insights.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
        {isLoadingOverview ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : isErrorOverview ? (
          <div className="col-span-full text-error bg-error-container/20 p-4 rounded-xl border border-error/30">Failed to load overview data.</div>
        ) : (
          <>
            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">groups</span>
                </div>
              </div>
              <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Total Leads</h4>
              <p className="text-display-lg font-display-lg text-on-surface">{overview.total}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
              <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Qualified Leads</h4>
              <p className="text-display-lg font-display-lg text-on-surface">{overview.qualified}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">cancel</span>
                </div>
              </div>
              <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Lost Leads</h4>
              <p className="text-display-lg font-display-lg text-on-surface">{overview.lost}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">insights</span>
                </div>
              </div>
              <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Conversion Rate</h4>
              <p className="text-display-lg font-display-lg text-on-surface">{overview.conversionRate}%</p>
            </div>
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-headline-md font-headline-md text-on-surface mb-6">Leads by Status</h3>
          <div className="flex-1 w-full relative">
            {isLoadingStatus ? <ChartSkeleton /> : isErrorStatus ? <EmptyState message="Failed to load status data" /> : statuses.length === 0 ? <EmptyState message="No data available" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statuses} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: '1px solid #c7c4d8' }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                    {statuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-headline-md font-headline-md text-on-surface mb-6">Leads by Source</h3>
          <div className="flex-1 w-full relative">
            {isLoadingSources ? <ChartSkeleton /> : isErrorSources ? <EmptyState message="Failed to load sources data" /> : sources.length === 0 ? <EmptyState message="No data available" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="source"
                    label
                  >
                    {sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #c7c4d8' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-gutter mb-8">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-headline-md font-headline-md text-on-surface mb-6">Monthly Leads (This Year)</h3>
          <div className="flex-1 w-full relative">
            {isLoadingMonthly ? <ChartSkeleton /> : isErrorMonthly ? <EmptyState message="Failed to load monthly data" /> : monthly.length === 0 ? <EmptyState message="No data available" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #c7c4d8' }} />
                  <Line type="monotone" dataKey="count" stroke="#006a61" strokeWidth={3} dot={{ r: 4, fill: '#006a61' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
