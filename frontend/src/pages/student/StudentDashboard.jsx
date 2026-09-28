import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Award, 
  Building2, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [jobsData, appsData] = await Promise.all([
          jobAPI.getAll().catch(() => []),
          applicationAPI.getMyApplications().catch(() => []),
        ]);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(appsData) ? appsData : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to fetch latest placement data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to check eligibility locally for card badge
  const isEligible = (job) => {
    if (!user) return false;
    const cgpaOk = (user.cgpa || 0) >= (job.minimumCGPA || 0);
    const branchOk = job.eligibleBranches?.includes(user.branch);
    return cgpaOk && branchOk;
  };

  const eligibleJobsCount = jobs.filter(isEligible).length;
  const interviewsCount = applications.filter(a => a.status === 'Interview').length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stats" />
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Campus Placement Season 2025–26
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user?.name || 'Student'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Track your placement journey, explore eligible opportunities, and prepare for upcoming interviews.
          </p>
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/student/drives">
              <Button variant="primary" size="md" icon={Search}>
                Browse All Drives
              </Button>
            </Link>
            <Link to="/student/ai-assistant">
              <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20" icon={Sparkles}>
                AI Interview Copilot
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eligible Drives</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{eligibleJobsCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{applications.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{interviewsCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selected</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{selectedCount}</p>
          </div>
        </div>
      </div>

      {/* Recommended Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Opportunities</h2>
            <p className="text-xs text-slate-500">Placement drives matching your profile & branch</p>
          </div>
          <Link to="/student/drives" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-sm text-slate-500">No active placement drives announced yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.slice(0, 6).map((job) => {
              const eligible = isEligible(job);
              const companyName = job.companyId?.name || 'Top Recruiting Company';
              
              return (
                <div 
                  key={job._id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {companyName}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{job.title}</h3>
                      </div>
                      <StatusBadge status={eligible ? 'Eligible' : 'Not Eligible'} size="sm" />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2 font-medium text-emerald-700">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 text-slate-600 mb-4 border border-slate-100">
                      <div><span className="font-semibold text-slate-700">Min CGPA:</span> {job.minimumCGPA}</div>
                      <div><span className="font-semibold text-slate-700">Branches:</span> {job.eligibleBranches?.join(' · ')}</div>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link to={`/student/drives?selected=${job._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Application Progress</h2>
            <p className="text-xs text-slate-500">Live status of your submitted applications</p>
          </div>
          <Link to="/student/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Track all ({applications.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-sm text-slate-500 mb-3">You haven't applied for any placement drives yet.</p>
            <Link to="/student/drives">
              <Button variant="primary" size="sm">Explore Drives & Apply</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{app.jobId?.title || 'Placement Role'}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <StatusBadge status={app.status} size="md" />
                  <Link to="/student/applications">
                    <Button variant="ghost" size="sm">Track</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
