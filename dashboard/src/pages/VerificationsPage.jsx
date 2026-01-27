import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';
import Sidebar from '../components/Sidebar';

const VerificationsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadVerifications();

    // Socket connection for real-time updates
    const socket = initSocket();
    
    socket.on('new_verification_request', (data) => {
      console.log('New verification request:', data);
      loadVerifications();
    });

    socket.on('verification_processed', (data) => {
      setVerifications(prev => prev.filter(v => v._id !== data.incidentId));
    });

    return () => {
      socket.off('new_verification_request');
      socket.off('verification_processed');
      disconnectSocket();
    };
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingVerifications();
      setVerifications(response.data.incidents || []);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (incidentId, bonusKarma = 0) => {
    try {
      setProcessing(true);
      await adminAPI.approveVerification(incidentId, bonusKarma);
      setVerifications(prev => prev.filter(v => v._id !== incidentId));
      setSelectedIncident(null);
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve verification');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      setProcessing(true);
      await adminAPI.rejectVerification(selectedIncident._id, rejectReason);
      setVerifications(prev => prev.filter(v => v._id !== selectedIncident._id));
      setShowRejectModal(false);
      setSelectedIncident(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject verification');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFF8F0]">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D] tracking-tight">
              Pending Verifications
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Review and verify volunteer resolutions before awarding karma
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-xl border border-amber-200">
              {verifications.length} Pending
            </span>
            <button
              onClick={loadVerifications}
              className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </header>

        {/* Verifications List */}
        {verifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending verifications to review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {verifications.map((incident) => (
              <div key={incident._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image Comparison */}
                <div className="grid grid-cols-2 h-48">
                  {/* Original Photo */}
                  <div className="relative">
                    <img
                      src={incident.photos?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image'}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded-lg">
                      Before
                    </span>
                  </div>
                  {/* Resolution Proof */}
                  <div className="relative">
                    <img
                      src={incident.verification?.proofPhotos?.[0]?.url || 'https://via.placeholder.com/300?text=No+Proof'}
                      alt="Resolution Proof"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">
                      After
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Priority & Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${getPriorityColor(incident.aiAnalysis?.priority)}`}>
                      {incident.aiAnalysis?.priority || 'medium'} priority
                    </span>
                    <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                      {incident.outcome || 'rescued'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {incident.aiAnalysis?.description || incident.description || 'No description available'}
                  </p>

                  {/* Volunteer Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#F4A261] rounded-full flex items-center justify-center text-white font-bold">
                      {incident.verification?.submittedBy?.name?.charAt(0) || 'V'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {incident.verification?.submittedBy?.name || 'Volunteer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {formatDate(incident.verification?.submittedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Current Karma</p>
                      <p className="font-bold text-[#F4A261]">
                        {incident.verification?.submittedBy?.volunteerData?.karmaPoints || 0}
                      </p>
                    </div>
                  </div>

                  {/* Resolution Notes */}
                  {incident.resolutionNotes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 mb-1">Resolution Notes:</p>
                      <p className="text-sm text-blue-800">{incident.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(incident._id)}
                      disabled={processing}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIncident(incident);
                        setShowRejectModal(true);
                      }}
                      disabled={processing}
                      className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejection. This will be sent to the volunteer.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedIncident(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing || !rejectReason.trim()}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {processing ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationsPage;
