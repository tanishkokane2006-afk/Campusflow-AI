import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Phone, BookOpen, Award, Calendar, Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    branch: 'CSE',
    cgpa: '',
    graduationYear: new Date().getFullYear(),
    education: 'B.Tech Computer Engineering',
    skillsInput: 'React, Node.js, Java, SQL',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const branchOptions = [
    { value: 'CSE', label: 'Computer Science (CSE)' },
    { value: 'IT', label: 'Information Technology (IT)' },
    { value: 'ENTC', label: 'Electronics & Telecommunication (ENTC)' },
    { value: 'ECE', label: 'Electronics & Communication (ECE)' },
    { value: 'MECH', label: 'Mechanical Engineering (MECH)' },
    { value: 'CIVIL', label: 'Civil Engineering (CIVIL)' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.cgpa) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const skills = formData.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        branch: formData.branch,
        cgpa: parseFloat(formData.cgpa),
        graduationYear: parseInt(formData.graduationYear, 10),
        education: formData.education,
        skills,
      };

      await register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          Join CampusFlow AI to explore placement drives and track applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="Amit Sharma"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="College Email"
                name="email"
                type="email"
                placeholder="student@college.edu"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="+91 9876543210"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Academic Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={branchOptions}
                required
              />

              <Input
                label="Current CGPA"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                icon={Award}
                value={formData.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Graduation Year"
                name="graduationYear"
                type="number"
                placeholder="2025"
                icon={Calendar}
                value={formData.graduationYear}
                onChange={handleChange}
                required
              />

              <Input
                label="Degree / Education"
                name="education"
                placeholder="B.Tech CSE"
                icon={BookOpen}
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Technical Skills (Comma separated)"
              name="skillsInput"
              placeholder="Java, React, Node.js, Python, SQL"
              icon={Wrench}
              value={formData.skillsInput}
              onChange={handleChange}
              helperText="Separate multiple skills with commas"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Register & Continue
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
