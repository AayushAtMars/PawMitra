import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentsAPI, petsAPI, volunteersAPI } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import RecentIncidents from '../components/RecentIncidents';
import Analytics from '../components/Analytics';
import Sidebar from '../components/Sidebar';

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
      const results = await Promise.allSettled([
        incidentsAPI.getAll({ status: 'active', limit: 10 }),
        petsAPI.getAll({ limit: 5 }),
        volunteersAPI.getStats(),
        incidentsAPI.getStats()
      ]);

      const [incidentsRes, petsRes, volunteersRes, statsRes] = results;
      const getData = (result) => result.status === 'fulfilled' ? result.value.data : {};

      const incidentsData = getData(incidentsRes).incidents || [];
      const statsData = getData(statsRes).stats || {};
      const petsData = getData(petsRes).pets || [];
      const volunteersData = getData(volunteersRes);

      setIncidents(incidentsData);

      setStats({
        totalIncidents: statsData.total || 0,
        activeIncidents: statsData.active || 0,
        resolvedIncidents: statsData.resolved || 0,
        totalPets: petsData.length || 0,
        adoptedPets: petsData.filter(p => p.status === 'adopted').length || 0,
        activeVolunteers: volunteersData.activeVolunteers || 0,
        trends: statsData.trends || [],
        priority: statsData.priority || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFF8F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Page Container */}
      <div className="flex-1 ml-64 p-8">
        {/* Page Header */}
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200/50">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D] tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-10 w-10 rounded-full ring-4 ring-[#FFF8F0] bg-[#F4A261] flex items-center justify-center text-white text-[10px] font-black uppercase">NGO</div>
              <div className="inline-block h-10 w-10 rounded-full ring-4 ring-[#FFF8F0] bg-[#2D2D2D] flex items-center justify-center text-white text-[10px] font-black uppercase">AD</div>
            </div>
            <button className="p-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors relative group">
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon="📋"
            color="orange"
            trend="+12%"
          />
          <StatsCard
            title="Active Emergency"
            value={stats.activeIncidents}
            icon="🚨"
            color="red"
            trend="+5%"
          />
          <StatsCard
            title="Successful Adoptions"
            value={stats.adoptedPets}
            icon="❤️"
            color="pink"
            trend="+15%"
          />
        </div>

        {/* Content Section: Map & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Map View - Takes 2 columns */}
          <div className="lg:col-span-2 group">
            <div className="modern-card p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#2D2D2D]">Live Incident Map</h2>
                  <p className="text-xs text-gray-400 font-medium">Real-time reports across the city</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live Updates
                </span>
              </div>
              <div className="flex-1 min-h-[450px] rounded-3xl overflow-hidden shadow-inner grayscale-[0.2] hover:grayscale-0 transition-all duration-500">
                <MapView incidents={incidents} />
              </div>
            </div>
          </div>

          {/* Recent Incidents - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#2D2D2D]">Recent Reports</h2>
                  <p className="text-xs text-gray-400 font-medium">Latest incoming alert signals</p>
                </div>
                <button className="text-[10px] font-black text-[#F4A261] uppercase tracking-wider hover:bg-[#F4A261]/10 px-3 py-1 rounded-full border border-[#F4A261]/20 transition-all">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <RecentIncidents incidents={incidents.slice(0, 8)} />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="modern-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-[#2D2D2D] tracking-tight">Analytics Insight</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Impact & Growth Trends</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-gray-50 hover:bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200/50">Export Data</button>
              <select className="bg-[#2D2D2D] text-white text-xs font-bold rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-gray-800 transition-all">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="h-[300px]">
            <Analytics trendData={stats.trends} priorityData={stats.priority} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
