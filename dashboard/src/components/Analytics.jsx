import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  // Mock data - replace with real API data
  const incidentTrendData = [
    { month: 'Jan', incidents: 45, resolved: 38 },
    { month: 'Feb', incidents: 52, resolved: 45 },
    { month: 'Mar', incidents: 48, resolved: 42 },
    { month: 'Apr', incidents: 61, resolved: 55 },
    { month: 'May', incidents: 55, resolved: 50 },
    { month: 'Jun', incidents: 67, resolved: 60 },
  ];

  const priorityData = [
    { name: 'High', value: 30, color: '#ef4444' },
    { name: 'Medium', value: 45, color: '#f59e0b' },
    { name: 'Low', value: 25, color: '#10b981' },
  ];

  const adoptionData = [
    { month: 'Jan', adopted: 12 },
    { month: 'Feb', adopted: 15 },
    { month: 'Mar', adopted: 18 },
    { month: 'Apr', adopted: 22 },
    { month: 'May', adopted: 20 },
    { month: 'Jun', adopted: 25 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Incident Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Incident Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={incidentTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Adoption Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Pet Adoption Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={adoptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="adopted" fill="#d946ef" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
