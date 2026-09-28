import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Building2, MapPin, IndianRupee, Eye, Search } from 'lucide-react';
import { jobAPI, companyAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { Input, Select, Textarea } from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const PlacementDrivesAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    skillsInput: 'Java, React, SQL',
    location: 'Pune',
    salary: '6 LPA',
    minimumCGPA: '7.0',
    eligibleBranches: ['CSE', 'IT', 'ENTC'],
    deadline: '',
  });

  const allBranches = ['CSE', 'IT', 'ENTC', 'ECE', 'MECH', 'CIVIL'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, compData] = await Promise.all([
        jobAPI.getAll(),
        companyAPI.getAll().catch(() => []),
      ]);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCompanies(Array.isArray(compData) ? compData : []);
    } catch (err) {
      console.error('Failed to load placement drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const exists = prev.eligibleBranches.includes(branch);
      const updated = exists
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch];
      return { ...prev, eligibleBranches: updated };
    });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !formData.title || !formData.deadline) {
      setToast({ message: 'Please complete all required fields.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const skills = formData.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        companyId: formData.companyId,
        title: formData.title,
        description: formData.description,
        skills,
        location: formData.location,
        salary: formData.salary,
        minimumCGPA: parseFloat(formData.minimumCGPA),
        eligibleBranches: formData.eligibleBranches,
        deadline: new Date(formData.deadline).toISOString(),
      };

      await jobAPI.create(payload);
      setToast({ message: 'Placement Drive created successfully!', type: 'success' });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Create drive error:', err);
      const msg = err.response?.data?.message || 'Failed to create placement drive.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.companyId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Drives</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, configure eligibility, and manage active campus recruitment drives.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Placement Drive
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search drive by role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Drives Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Placement Drives Announced"
          description="Create your first placement drive to allow students to apply."
          actionLabel="Create Drive"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Company & Role</th>
                  <th className="px-6 py-3">Location & Salary</th>
                  <th className="px-6 py-3">Min CGPA</th>
                  <th className="px-6 py-3">Eligible Branches</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3 text-right">Applicants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-blue-600 text-xs font-semibold">{job.companyId?.name || 'Recruiter'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{job.location}</div>
                      <div className="text-emerald-700 font-bold">{job.salary || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{job.minimumCGPA}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {job.eligibleBranches?.map((b) => (
                          <span key={b} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(job.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/applicants?jobId=${job._id}`}>
                        <Button variant="outline" size="sm" icon={Eye}>
                          Manage Applicants
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Placement Drive"
        subtitle="Specify position details, salary package, and eligibility cutoffs"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <Select
            label="Recruiting Company"
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            options={companies.map((c) => ({ value: c._id, label: c.name }))}
            required
            placeholder="Select a registered company..."
          />

          <Input
            label="Job Title / Role Name"
            placeholder="e.g. Software Engineer / Graduate Trainee"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g. Pune / Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <Input
              label="Salary CTC"
              placeholder="e.g. 6.5 LPA"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum CGPA Cutoff"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.0"
              value={formData.minimumCGPA}
              onChange={(e) => setFormData({ ...formData, minimumCGPA: e.target.value })}
              required
            />
            <Input
              label="Application Deadline Date"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Eligible Branches
            </label>
            <div className="flex flex-wrap gap-3">
              {allBranches.map((b) => {
                const checked = formData.eligibleBranches.includes(b);
                return (
                  <label key={b} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    checked ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => handleBranchToggle(b)}
                    />
                    {b} {checked && '✓'}
                  </label>
                );
              })}
            </div>
          </div>

          <Input
            label="Required Skills (Comma separated)"
            value={formData.skillsInput}
            onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
            placeholder="e.g. Java, Python, SQL"
          />

          <Textarea
            label="Full Job Description & Criteria"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter responsibilities, selection rounds, and requirements..."
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Publish Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementDrivesAdmin;
