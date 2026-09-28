import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  Award, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normalizedStatus = (status || '').toString().trim();

  const configs = {
    Applied: {
      label: 'Applied',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
    },
    Shortlisted: {
      label: 'Shortlisted',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: UserCheck,
    },
    Interview: {
      label: 'Interview Scheduled',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Calendar,
    },
    Selected: {
      label: 'Selected',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Award,
    },
    Rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    },
    Eligible: {
      label: 'Eligible',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    'Not Eligible': {
      label: 'Not Eligible',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: AlertCircle,
    },
  };

  const config = configs[normalizedStatus] || {
    label: normalizedStatus || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
