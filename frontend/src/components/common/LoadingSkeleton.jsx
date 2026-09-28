import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="h-4 bg-slate-200 rounded-sm w-1/2 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded-md w-1/3 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded-sm w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 border-b border-slate-200 px-6 py-4"></div>
        {items.map((_, i) => (
          <div key={i} className="h-14 border-b border-slate-100 px-6 flex items-center gap-4">
            <div className="h-4 bg-slate-200 rounded-sm w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-1/6 ml-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="w-2/3 space-y-2">
              <div className="h-5 bg-slate-200 rounded-sm w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-sm w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-100 mt-4">
            <div className="h-4 bg-slate-100 rounded-sm w-1/4"></div>
            <div className="h-4 bg-slate-100 rounded-sm w-1/4"></div>
            <div className="h-4 bg-slate-100 rounded-sm w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
