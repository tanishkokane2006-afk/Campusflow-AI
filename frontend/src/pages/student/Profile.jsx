import React, { useState } from 'react';
import { User, Mail, Phone, Award, BookOpen, Calendar, Plus, X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import Toast from '../../components/common/Toast';

const Profile = () => {
  const { user, setUser } = useAuth();

  const [skills, setSkills] = useState(user?.skills || ['React', 'Node.js', 'Java', 'SQL']);
  const [newSkill, setNewSkill] = useState('');
  const [resumeName, setResumeName] = useState(user?.resume || 'Amit_Sharma_Resume.pdf');
  const [toast, setToast] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 9876543210',
    branch: user?.branch || 'CSE',
    cgpa: user?.cgpa || '8.5',
    graduationYear: user?.graduationYear || '2025',
    education: user?.education || 'B.Tech Computer Science',
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill('');
      setUser((prev) => ({ ...prev, skills: updated }));
      setToast({ message: 'Skill added to profile!', type: 'success' });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    setUser((prev) => ({ ...prev, skills: updated }));
    setToast({ message: 'Skill removed.', type: 'info' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
      setUser((prev) => ({ ...prev, resume: file.name }));
      setToast({ message: `Uploaded ${file.name} successfully!`, type: 'success' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep your academic parameters and technical skills up to date for recruiter shortlisting.
        </p>
      </div>

      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{user?.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Branch: {user?.branch || 'CSE'}
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              CGPA: {user?.cgpa || '8.5'} / 10.0
            </span>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Graduation: {user?.graduationYear || '2025'}
            </span>
          </div>
        </div>
      </div>

      {/* Academic & Personal Details */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Personal & Academic Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" icon={User} value={personalInfo.name} readOnly disabled />
          <Input label="Email Address" icon={Mail} value={personalInfo.email} readOnly disabled />
          <Input label="Phone Number" icon={Phone} value={personalInfo.phone} readOnly disabled />
          <Input label="Academic Branch" icon={BookOpen} value={personalInfo.branch} readOnly disabled />
          <Input label="Current CGPA" icon={Award} value={personalInfo.cgpa} readOnly disabled />
          <Input label="Graduation Year" icon={Calendar} value={personalInfo.graduationYear} readOnly disabled />
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Skills</h3>
          <p className="text-xs text-slate-500 mt-0.5">Skills listed here will be used for automated eligibility checks.</p>
        </div>

        {/* Skill Chip Editor */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Skill Input */}
        <form onSubmit={handleAddSkill} className="flex gap-3 max-w-md">
          <Input
            placeholder="Add a new skill (e.g. Docker, Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <Button type="submit" variant="primary" icon={Plus}>
            Add
          </Button>
        </form>
      </div>

      {/* Resume Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Placement Resume</h3>
          <p className="text-xs text-slate-500 mt-0.5">Upload your PDF resume for placement officers and company recruiters.</p>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">{resumeName}</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">PDF format · Max size 5MB</p>

          <label className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer gap-2 transition-colors">
            <Upload className="w-4 h-4 text-slate-500" />
            Upload New Resume
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;
