import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // We'll install recharts

const data = [
  { name: 'Mon', leads: 40, qualified: 24 },
  { name: 'Tue', leads: 30, qualified: 13 },
  { name: 'Wed', leads: 20, qualified: 98 },
  { name: 'Thu', leads: 27, qualified: 39 },
  { name: 'Fri', leads: 18, qualified: 48 },
  { name: 'Sat', leads: 23, qualified: 38 },
  { name: 'Sun', leads: 34, qualified: 43 },
];

const DashboardOverview = () => {
  return (
    <div className="max-w-container-max mx-auto">
      <div className="mb-8">
        <h3 className="text-headline-lg font-headline-lg text-on-surface mb-2">Overview</h3>
        <p className="text-body-md font-body-md text-on-surface-variant">Your key metrics for the current quarter.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <span className="bg-secondary-container/30 text-secondary-fixed-dim text-label-sm font-label-sm px-2 py-1 rounded-md flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +12%
            </span>
          </div>
          <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Total Leads</h4>
          <p className="text-display-lg font-display-lg text-on-surface">4,289</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="bg-secondary-container/30 text-secondary-fixed-dim text-label-sm font-label-sm px-2 py-1 rounded-md flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +5.4%
            </span>
          </div>
          <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Qualified Leads</h4>
          <p className="text-display-lg font-display-lg text-on-surface">1,842</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <span className="bg-error-container/30 text-error text-label-sm font-label-sm px-2 py-1 rounded-md flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_down</span> -1.2%
            </span>
          </div>
          <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Conversion Rate</h4>
          <p className="text-display-lg font-display-lg text-on-surface">24.8%</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span className="text-on-surface-variant text-label-sm font-label-sm px-2 py-1">Today</span>
          </div>
          <h4 className="text-label-md font-label-md text-on-surface-variant mb-1">Recent Activity</h4>
          <p className="text-display-lg font-display-lg text-on-surface">156</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/50">
            <div>
              <h3 className="text-headline-md font-headline-md text-on-surface">Weekly Lead Growth</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Comparing total vs qualified leads over 7 days.</p>
            </div>
            <button className="text-primary hover:bg-surface-container-low px-3 py-1.5 rounded-md text-label-sm font-label-sm transition-colors border border-outline-variant/30 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
              This Week
            </button>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: '1px solid #c7c4d8' }} />
                <Bar dataKey="leads" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qualified" fill="#006a61" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/50">
            <h3 className="text-headline-md font-headline-md text-on-surface">Recent Leads</h3>
            <button className="p-1 rounded hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-label-md">
                  AC
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Acme Corp</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Enterprise Plan</p>
                </div>
              </div>
              <span className="bg-secondary-container/30 text-secondary-fixed-dim text-label-sm font-label-sm px-2 py-1 rounded-md">Hot</span>
            </div>

            <div className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-bold text-label-md">
                  GL
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Global Logistics</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Pro Plan</p>
                </div>
              </div>
              <span className="bg-surface-variant text-on-surface-variant text-label-sm font-label-sm px-2 py-1 rounded-md">Warm</span>
            </div>

            <div className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error font-bold text-label-md">
                  TS
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Tech Solutions</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Starter Plan</p>
                </div>
              </div>
              <span className="bg-surface-variant text-on-surface-variant text-label-sm font-label-sm px-2 py-1 rounded-md">Cold</span>
            </div>
            
            <div className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-label-md">
                  N
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Nexus Industries</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Enterprise Plan</p>
                </div>
              </div>
              <span className="bg-secondary-container/30 text-secondary-fixed-dim text-label-sm font-label-sm px-2 py-1 rounded-md">Hot</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg text-label-md font-label-md text-primary hover:bg-surface-container-low transition-colors">
            View All Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
