import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Briefcase, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, eligibilityAPI, applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

const PlacementDrives = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedParam = searchParams.get('selected');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [maxCgpaFilter, setMaxCgpaFilter] = useState('');

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);

  // Track user applications to disable apply button if already applied
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsData, myApps] = await Promise.all([
          jobAPI.getAll(),
          applicationAPI.getMyApplications().catch(() => []),
        ]);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        if (Array.isArray(myApps)) {
          const ids = new Set(myApps.map((a) => (typeof a.jobId === 'object' ? a.jobId?._id : a.jobId)));
          setAppliedJobIds(ids);
        }
      } catch (err) {
        console.error('Failed to load placement drives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Open modal if URL has ?selected=jobId
  useEffect(() => {
    if (selectedParam && jobs.length > 0) {
      const found = jobs.find((j) => j._id === selectedParam);
      if (found) {
        handleViewDetails(found);
      }
    }
  }, [selectedParam, jobs]);

  const handleViewDetails = async (job) => {
    setSelectedJob(job);
    setEligibilityLoading(true);
    setEligibilityResult(null);
    try {
      const result = await eligibilityAPI.check(job._id);
      setEligibilityResult(result);
    } catch (err) {
      console.error('Failed to check eligibility:', err);
    } finally {
      setEligibilityLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      await applicationAPI.apply(jobId);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setSelectedJob(null);
    } catch (err) {
      console.error('Apply error:', err);
      const msg = err.response?.data?.message || 'Failed to submit application.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  const isLocallyEligible = (job) => {
    if (!user) return false;
    const cgpaOk = (user.cgpa || 0) >= (job.minimumCGPA || 0);
    const branchOk = job.eligibleBranches?.includes(user.branch);
    return cgpaOk && branchOk;
  };

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.companyId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch =
      selectedBranch === 'ALL' || job.eligibleBranches?.includes(selectedBranch);

    const matchesCgpa =
      !maxCgpaFilter || (user?.cgpa || 0) >= parseFloat(maxCgpaFilter);

    return matchesSearch && matchesBranch && matchesCgpa;
  });

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Drives</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore upcoming company placement drives and check your eligibility.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by role, company, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ENTC">ENTC</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Placement Drives Found"
          description="Try clearing your search query or filters to discover active placement opportunities."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const eligible = isLocallyEligible(job);
            const isApplied = appliedJobIds.has(job._id);
            const companyName = job.companyId?.name || 'Recruiter';

            return (
              <div
                key={job._id}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {companyName}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{job.title}</h3>
                    </div>
                    <StatusBadge status={eligible ? 'Eligible' : 'Not Eligible'} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div><span className="font-semibold text-slate-700">Min CGPA:</span> {job.minimumCGPA}</div>
                    <div><span className="font-semibold text-slate-700">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}</div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(job)}
                  >
                    View Details
                  </Button>

                  {isApplied ? (
                    <Button variant="secondary" size="sm" disabled icon={CheckCircle2}>
                      Applied
                    </Button>
                  ) : eligible ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApply(job._id)}
                      isLoading={applying}
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      Ineligible
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Job Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Details'}
        subtitle={selectedJob?.companyId?.name || 'Recruiting Company'}
        maxWidth="max-w-2xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase">Location</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase">Salary Package</p>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">{selectedJob.salary || 'Best in Industry'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase">Deadline</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Description</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{selectedJob.description}</p>
            </div>

            {/* Eligibility Breakdown */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Eligibility Analysis</span>
                {eligibilityLoading && <span className="text-blue-600 animate-pulse text-[11px]">Evaluating...</span>}
              </h4>

              {eligibilityResult ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    eligibilityResult.eligible 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {eligibilityResult.eligible ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>You are fully eligible for this placement drive.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>You are not eligible based on criteria below.</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-slate-500">CGPA Requirement</p>
                      <p className="font-bold text-slate-800 mt-1">
                        Your CGPA: {user?.cgpa} / Required: {selectedJob.minimumCGPA}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-slate-500">Branch Requirement</p>
                      <p className="font-bold text-slate-800 mt-1">
                        Your Branch: {user?.branch} {selectedJob.eligibleBranches?.includes(user?.branch) ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>

                  {eligibilityResult.reasons && eligibilityResult.reasons.length > 0 && (
                    <div className="text-xs text-rose-700 bg-rose-50/60 p-3 rounded-lg space-y-1">
                      <p className="font-semibold">Reason(s) for ineligibility:</p>
                      <ul className="list-disc list-inside">
                        {eligibilityResult.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Loading eligibility requirements...</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              {appliedJobIds.has(selectedJob._id) ? (
                <Button variant="secondary" disabled icon={CheckCircle2}>
                  Already Applied
                </Button>
              ) : eligibilityResult?.eligible ? (
                <Button
                  variant="primary"
                  onClick={() => handleApply(selectedJob._id)}
                  isLoading={applying}
                >
                  Confirm & Apply
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Cannot Apply
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlacementDrives;
