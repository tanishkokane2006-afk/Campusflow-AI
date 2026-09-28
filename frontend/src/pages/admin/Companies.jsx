import React, { useState, useEffect } from 'react';
import { Building2, Plus, Globe, ExternalLink, Search } from 'lucide-react';
import { companyAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Company Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    description: '',
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getAll();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await companyAPI.create(formData);
      setToast({ message: `Company '${formData.name}' created successfully!`, type: 'success' });
      setIsModalOpen(false);
      setFormData({ name: '', industry: '', website: '', description: '' });
      fetchCompanies();
    } catch (err) {
      console.error('Create company error:', err);
      const msg = err.response?.data?.message || 'Failed to create company.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register and manage recruiting partners for campus placement drives.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Company
        </Button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
          Total: {filteredCompanies.length} companies
        </span>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Companies Found"
          description="Click 'Add New Company' to register your first placement partner."
          actionLabel="Add New Company"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-base font-bold text-slate-900 truncate">{comp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{comp.industry || 'Tech & IT Services'}</p>
                  </div>
                </div>

                {comp.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {comp.description}
                  </p>
                )}
              </div>

              {comp.website && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </span>
                  <a
                    href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {comp.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Recruiting Company"
        subtitle="Enter company details to register them in CampusFlow AI"
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Tata Consultancy Services (TCS)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Industry Domain"
            placeholder="e.g. IT Services / Fintech / Analytics"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />

          <Input
            label="Website URL"
            placeholder="e.g. https://www.tcs.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <Textarea
            label="Company Description"
            placeholder="Brief description of the recruiting organization..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Company
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
