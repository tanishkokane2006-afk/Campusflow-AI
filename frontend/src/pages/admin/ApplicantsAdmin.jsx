import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Filter, CheckCircle2, XCircle, Calendar, UserCheck, Award, Search } from 'lucide-react';
import { jobAPI, applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { Select } from '../../components/common/Input';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const ApplicantsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlJobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(urlJobId || '');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsList = await jobAPI.getAll();
        const list = Array.isArray(jobsList) ? jobsList : [];
        setJobs(list);
        if (!selectedJobId && list.length > 0) {
          setSelectedJobId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load jobs list:', err);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
      setSearchParams({ jobId: selectedJobId });
    }
  }, [selectedJobId]);

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const data = await applicationAPI.getJobApplications(jobId);
      setApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      setToast({ message: `Applicant status updated to '${newStatus}'`, type: 'success' });
      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error('Update status error:', err);
      const msg = err.response?.data?.message || 'Failed to update status.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const student = app.studentId || {};
    const matchesSearch =
      (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.branch || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeJob = jobs.find((j) => j._id === selectedJobId);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Applicant Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, shortlist, and manage interview rounds for student placement applications.
        </p>
      </div>

      {/* Drive Selector Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Select Placement Drive"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            options={jobs.map((j) => ({
              value: j._id,
              label: `${j.title} (${j.companyId?.name || 'Recruiter'})`,
            }))}
            placeholder="Choose drive to view applicants..."
          />

          <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Applied', label: 'Applied' },
              { value: 'Shortlisted', label: 'Shortlisted' },
              { value: 'Interview', label: 'Interview' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
        </div>

        {activeJob && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900">{activeJob.title}</span> · Min CGPA: <strong className="text-slate-800">{activeJob.minimumCGPA}</strong> · Eligible: <strong className="text-slate-800">{activeJob.eligibleBranches?.join(', ')}</strong>
            </div>
            <div className="font-semibold text-blue-600">
              Total Applicants: {applicants.length}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student by name, email, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Applicants Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredApplicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Applicants Found"
          description="There are currently no student applications for the selected drive or status filter."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Branch & CGPA</th>
                  <th className="px-6 py-3">Skills</th>
                  <th className="px-6 py-3">Applied Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApplicants.map((app) => {
                  const student = app.studentId || {};
                  const isUpdating = updatingId === app._id;

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{student.name || 'Student Name'}</div>
                        <div className="text-slate-500 text-[11px]">{student.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{student.branch || 'N/A'}</div>
                        <div className="text-emerald-700 font-bold">CGPA: {student.cgpa || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {student.skills && student.skills.length > 0 ? (
                            student.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 font-normal">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {app.status !== 'Shortlisted' && (
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded text-[11px] border border-amber-200 transition-colors"
                            >
                              Shortlist
                            </button>
                          )}

                          {app.status !== 'Interview' && (
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Interview')}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded text-[11px] border border-purple-200 transition-colors"
                            >
                              Interview
                            </button>
                          )}

                          {app.status !== 'Selected' && (
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Selected')}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[11px] border border-emerald-200 transition-colors"
                            >
                              Select
                            </button>
                          )}

                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                              disabled={isUpdating}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsAdmin;
