import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Briefcase, Building2, CheckCircle2 } from 'lucide-react';

const AnalyticsAdmin = () => {
  const branchMetrics = [
    { branch: 'Computer Science (CSE)', total: 120, placed: 104, rate: '86.6%' },
    { branch: 'Information Technology (IT)', total: 95, placed: 81, rate: '85.2%' },
    { branch: 'Electronics & Telecom (ENTC)', total: 80, placed: 62, rate: '77.5%' },
    { branch: 'Mechanical Engineering (MECH)', total: 60, placed: 41, rate: '68.3%' },
    { branch: 'Civil Engineering (CIVIL)', total: 45, placed: 28, rate: '62.2%' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time placement statistics, branch conversion ratios, and company drive metrics.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">400</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> 100% Eligible Batch
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Offers</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">316</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Across 18 companies</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Placement Rate</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">79.0%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+5.2% vs last year</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Package</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">18.5 LPA</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Avg Package: 6.8 LPA</span>
        </div>
      </div>

      {/* Branch Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" /> Branch-wise Placement Breakdown
        </h2>

        <div className="space-y-4">
          {branchMetrics.map((item) => (
            <div key={item.branch} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{item.branch}</span>
                <span className="text-slate-600">
                  {item.placed} / {item.total} Students ({item.rate})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: item.rate }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAdmin;
