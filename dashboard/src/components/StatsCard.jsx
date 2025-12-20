import React from 'react';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover border-l-4 border-transparent hover:border-primary-500 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2">
              <span className="font-semibold">{trend}</span> from last month
            </p>
          )}
        </div>
        <div className={`text-4xl p-4 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
