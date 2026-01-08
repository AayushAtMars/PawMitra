import React from 'react';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="modern-card p-6 flex items-center justify-between group transition-all duration-300">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${colorClasses[color] || colorClasses.blue} transition-transform duration-300 group-hover:scale-110 shadow-sm font-bold text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[#2D2D2D] tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <span className="text-6xl select-none">{icon}</span>
      </div>
    </div>
  );
};

export default StatsCard;
