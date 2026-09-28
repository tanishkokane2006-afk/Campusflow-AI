import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, eligibilityAPI, applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';

const JobDetails = () => {
  const { jobId } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJobAndEligibility = async () => {
      try {
        setLoading(true);
        const [jobsList, myApps] = await Promise.all([
          jobAPI.getAll(),
          applicationAPI.getMyApplications().catch(() => []),
        ]);

        const targetJob = jobsList.find((j) => j._id === jobId);
        setJob(targetJob);

        if (targetJob) {
          const checkRes = await eligibilityAPI.check(jobId).catch(() => null);
          setEligibility(checkRes);
        }

        if (Array.isArray(myApps)) {
          const hasApplied = myApps.some(
            (a) => (typeof a.jobId === 'object' ? a.jobId?._id : a.jobId) === jobId
          );
          setApplied(hasApplied);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobAndEligibility();
    }
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationAPI.apply(jobId);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setApplied(true);
    } catch (err) {
      console.error('Application failed:', err);
      const msg = err.response?.data?.message || 'Failed to submit application.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="card" count={2} />;
  }

  if (!job) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
        <h3 className="text-base font-bold text-slate-900 mb-2">Placement Drive Not Found</h3>
        <p className="text-sm text-slate-500 mb-4">The placement drive you are looking for may have expired or been removed.</p>
        <Link to="/student/drives">
          <Button variant="outline">Back to Placement Drives</Button>
        </Link>
      </div>
    );
  }

  const company = job.companyId || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Back button */}
      <Link to="/student/drives" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Drives
      </Link>

      {/* Header Info */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <Building2 className="w-4 h-4" /> {company.name || 'Recruiter'}
            </span>
            {company.website && (
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{company.industry || 'Technology & Engineering'}</p>
        </div>

        <div className="flex items-center gap-3">
          {applied ? (
            <Button variant="secondary" size="lg" disabled icon={CheckCircle2}>
              Already Applied
            </Button>
          ) : eligibility?.eligible ? (
            <Button variant="primary" size="lg" onClick={handleApply} isLoading={applying}>
              Apply Now
            </Button>
          ) : (
            <Button variant="secondary" size="lg" disabled>
              Ineligible to Apply
            </Button>
          )}
        </div>
      </div>

      {/* Key Info Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-slate-200 text-xs">
        <div>
          <p className="text-slate-400 font-semibold uppercase">Location</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">{job.location}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase">Salary Package</p>
          <p className="font-bold text-emerald-700 text-sm mt-0.5">{job.salary || 'Best in Industry'}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase">Min CGPA</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">{job.minimumCGPA} / 10.0</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase">Application Deadline</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">{new Date(job.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Visually Clear Eligibility Result Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Eligibility Status & Criteria
        </h3>

        {eligibility ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              eligibility.eligible ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {eligibility.eligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {eligibility.eligible ? '✓ You are eligible for this placement drive' : 'You do not meet the eligibility requirements'}
                </p>
                <p className="text-xs opacity-90 mt-1">
                  {eligibility.eligible 
                    ? 'Your CGPA and academic branch fulfill all recruiter criteria.' 
                    : 'Please see the detailed parameter breakdown below.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Academic CGPA</span>
                <p className="text-slate-600">Minimum Required: <strong className="text-slate-900">{job.minimumCGPA}</strong></p>
                <p className="text-slate-600">Your Current CGPA: <strong className="text-slate-900">{user?.cgpa}</strong></p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Eligible Branches</span>
                <p className="text-slate-600">Allowed: <strong className="text-slate-900">{job.eligibleBranches?.join(', ')}</strong></p>
                <p className="text-slate-600">Your Branch: <strong className="text-slate-900">{user?.branch}</strong></p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Evaluating eligibility...</p>
        )}
      </div>

      {/* Description */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Job Description</h3>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-md font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
