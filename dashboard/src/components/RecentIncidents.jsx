import React from 'react';

const RecentIncidents = ({ incidents = [] }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent incidents</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {incidents.map((incident) => (
        <div
          key={incident._id}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {incident.animalType || 'Animal'} in distress
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                📍 {incident.address || 'Location not available'}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(incident.priority)}`}>
              {incident.priority?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(incident.status)}`}>
              {incident.status || 'Reported'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(incident.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentIncidents;
