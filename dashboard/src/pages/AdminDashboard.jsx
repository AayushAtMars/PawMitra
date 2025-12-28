import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentsAPI, petsAPI, volunteersAPI } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import RecentIncidents from '../components/RecentIncidents';
import Analytics from '../components/Analytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    totalPets: 0,
    adoptedPets: 0,
    activeVolunteers: 0,
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Initialize Socket Connection
    const socket = initSocket();
    
    // Listen for new incidents
    socket.on('new_incident', (incident) => {
      console.log('New incident received:', incident);
      setIncidents((prev) => [incident, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalIncidents: prev.totalIncidents + 1,
        activeIncidents: prev.activeIncidents + 1,
      }));
    });

    // Listen for incident updates
    socket.on('incident_updated', (updatedIncident) => {
      console.log('Incident updated:', updatedIncident);
      setIncidents((prev) =>
        prev.map((inc) => (inc._id === updatedIncident._id ? updatedIncident : inc))
      );
      // Ideally re-fetch stats to be accurate, or calculate diff
    });

    return () => {
      socket.off('new_incident');
      socket.off('incident_updated');
      disconnectSocket();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [incidentsRes, petsRes, volunteersRes] = await Promise.all([
        incidentsAPI.getAll({ limit: 10 }),
        petsAPI.getAll({ limit: 5 }),
        volunteersAPI.getStats(),
      ]);

      const incidentsData = incidentsRes.data.incidents || [];
      setIncidents(incidentsData);

      setStats({
        totalIncidents: incidentsData.length,
        activeIncidents: incidentsData.filter(i => i.status === 'reported' || i.status === 'assigned').length,
        resolvedIncidents: incidentsData.filter(i => i.status === 'resolved').length,
        totalPets: petsRes.data.pets?.length || 0,
        adoptedPets: petsRes.data.pets?.filter(p => p.status === 'adopted').length || 0,
        activeVolunteers: volunteersRes.data.activeVolunteers || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🐾 PawMitra Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">NGO & Admin Control Panel</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon="📋"
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Active Incidents"
            value={stats.activeIncidents}
            icon="🚨"
            color="red"
            trend="+5%"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolvedIncidents}
            icon="✅"
            color="green"
            trend="+8%"
          />
          <StatsCard
            title="Total Pets"
            value={stats.totalPets}
            icon="🐕"
            color="purple"
            trend="+3%"
          />
          <StatsCard
            title="Adopted Pets"
            value={stats.adoptedPets}
            icon="❤️"
            color="pink"
            trend="+15%"
          />
          <StatsCard
            title="Active Volunteers"
            value={stats.activeVolunteers}
            icon="👥"
            color="indigo"
            trend="+7%"
          />
        </div>

        {/* Map and Recent Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Map</h2>
            <MapView incidents={incidents} height={400} />
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
            <RecentIncidents incidents={incidents.slice(0, 5)} />
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <Analytics />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
