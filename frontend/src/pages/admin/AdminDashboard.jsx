import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Calendar, 
  Award, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Eye
} from 'lucide-react';
import { companyAPI, jobAPI, applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [compData, jobsData] = await Promise.all([
          companyAPI.getAll().catch(() => []),
          jobAPI.getAll().catch(() => []),
        ]);
        setCompanies(Array.isArray(compData) ? compData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stats" />
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Officer Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage company relationships, create placement drives, and track applicant shortlisting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/companies">
            <Button variant="outline" size="md" icon={Building2}>
              Add Company
            </Button>
          </Link>
          <Link to="/admin/drives">
            <Button variant="primary" size="md" icon={Plus}>
              Create Placement Drive
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Drives</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{jobs.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{companies.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Drives</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{jobs.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">82%</p>
          </div>
        </div>
      </div>

      {/* Active Placement Drives Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Placement Drives</h2>
            <p className="text-xs text-slate-500">Overview of active drives and eligibility criteria</p>
          </div>
          <Link to="/admin/drives" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No placement drives created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Company & Role</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Min CGPA</th>
                  <th className="px-6 py-3">Eligible Branches</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-slate-500 text-[11px]">{job.companyId?.name || 'Recruiter'}</div>
                    </td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{job.minimumCGPA}</td>
                    <td className="px-6 py-4">{job.eligibleBranches?.join(', ')}</td>
                    <td className="px-6 py-4">{new Date(job.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/applicants?jobId=${job._id}`}>
                        <Button variant="outline" size="sm" icon={Eye}>
                          View Applicants
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered Companies Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Partner Companies</h2>
            <p className="text-xs text-slate-500">Registered recruiting organizations</p>
          </div>
          <Link to="/admin/companies">
            <Button variant="ghost" size="sm">Manage Companies</Button>
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">No companies registered yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.slice(0, 6).map((comp) => (
              <div key={comp._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{comp.industry || 'Technology'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
