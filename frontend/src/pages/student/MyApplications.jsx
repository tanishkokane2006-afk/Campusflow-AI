import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Building2, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  Award, 
  XCircle,
  Sparkles
} from 'lucide-react';
import { applicationAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationAPI.getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const pipelineSteps = ['Applied', 'Shortlisted', 'Interview', 'Selected'];

  const getStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    return pipelineSteps.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your placement drive applications in real-time.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applications Submitted Yet"
          description="Browse open placement drives and submit applications to start your placement journey."
          actionLabel="Explore Placement Drives"
          onAction={() => (window.location.href = '/student/drives')}
        />
      ) : (
        <div className="space-y-5">
          {applications.map((app) => {
            const job = app.jobId || {};
            const companyName = job.companyId?.name || 'Recruiting Company';
            const currentStepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-600">{companyName}</span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title || 'Placement Drive'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} size="lg" />
                    {app.status === 'Interview' && (
                      <Link to="/student/ai-assistant">
                        <Button variant="primary" size="sm" icon={Sparkles}>
                          Prep with AI
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Job Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs">
                  {job.location && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="text-slate-500">
                    Job ID: <span className="font-mono text-slate-700">{app._id.substring(0, 8)}...</span>
                  </div>
                </div>

                {/* Visual Progress Tracker Pipeline */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Selection Pipeline Progress
                  </p>

                  {isRejected ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Application Status: Application rejected by recruitment officer.</span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                      {/* Connecting Line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
                        style={{
                          width: `${Math.max(0, (currentStepIdx / (pipelineSteps.length - 1)) * 100)}%`,
                        }}
                      />

                      {/* Step Nodes */}
                      {pipelineSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                  : 'bg-white text-slate-400 border-2 border-slate-300'
                              } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`mt-2 text-[11px] font-semibold tracking-tight ${
                                isCurrent
                                  ? 'text-blue-700 font-bold'
                                  : isCompleted
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
