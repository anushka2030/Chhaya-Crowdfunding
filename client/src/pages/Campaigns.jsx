import React, { useEffect, useState } from 'react';
import { Eye, Trash2, CheckCircle, XCircle, Loader2, Calendar, MapPin, User, Target, TrendingUp, FileText } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/campaigns${status ? `?status=${status}` : ''}`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveOrReject = async (id, action) => {
    try {
      await fetch(`${baseURL}/admin/campaigns/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ verificationNotes: `${action} by admin` })
      });
      fetchCampaigns();
    } catch (err) {
      alert('Action failed');
    }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await fetch(`${baseURL}/admin/delete-campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      fetchCampaigns();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openPreview = (campaign) => {
    if (status === 'pending_review') {
      setSelectedCampaign(campaign);
      setShowPreview(true);
    } else {
      window.open(`/campaign/${campaign._id}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusBadge = (campaign) => {
    const statusColors = {
      'active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'pending_review': 'bg-amber-100 text-amber-700 border-amber-200',
      'draft': 'bg-gray-100 text-gray-600 border-gray-200',
      'completed': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'paused': 'bg-orange-100 text-orange-700 border-orange-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'cancelled': 'bg-slate-100 text-slate-600 border-slate-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[campaign.status] || statusColors.draft}`}>
        {campaign.status.replace('_', ' ')}
        {campaign.isVerified && campaign.status === 'active' && (
          <CheckCircle className="inline-block w-3 h-3 ml-1" />
        )}
      </span>
    );
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-teal-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h3 className="font-semibold mb-2">Error Loading Campaigns</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-800">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="backdrop-blur-sm rounded-xl  shadow-sm">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">
            {status ? `${status.replace('_', ' ').toUpperCase()} Campaigns` : 'All Campaigns'}
          </h1>
          {/* <p className="text-teal-600">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found
          </p> */}
        </div>

        {/* Campaigns Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl  shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-500 to-cyan-900 text-white">
                  <th className="text-left p-4 font-semibold">Campaign Details</th>
                  <th className="text-left p-4 font-semibold">Beneficiary</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Funding Progress</th>
                  <th className="text-left p-4 font-semibold">Timeline</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr 
                    key={campaign._id} 
                    className={`border-b border-cyan-100 hover:bg-cyan-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-cyan-25/30'
                    }`}
                  >
                    {/* Campaign Details */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-teal-800 text-sm leading-tight">
                          {campaign.title}
                          {campaign.isUrgent && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                              URGENT
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-teal-600">
                          <User className="w-3 h-3" />
                          <span>{campaign.creator?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-cyan-600">
                          <FileText className="w-3 h-3" />
                          <span>{campaign.cause?.name || 'General'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Beneficiary */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-teal-700">
                          {campaign.beneficiary?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-cyan-600 capitalize">
                          {campaign.beneficiary?.relationship || 'N/A'}
                        </p>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-teal-600">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {campaign.location?.city && campaign.location?.state 
                            ? `${campaign.location.city}, ${campaign.location.state}`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </td>

                    {/* Funding Progress */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-teal-600">Raised</span>
                          <span className="text-xs font-semibold text-teal-800">
                            {getProgressPercentage(campaign.raisedAmount || 0, campaign.goalAmount).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${getProgressPercentage(campaign.raisedAmount || 0, campaign.goalAmount)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <TrendingUp className="w-3 h-3 text-teal-600" />
                            <span className="font-bold text-teal-700">
                              ₹{(campaign.raisedAmount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Target className="w-3 h-3 text-cyan-600" />
                            <span className="text-cyan-600">
                              ₹{campaign.goalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-teal-500">
                            {campaign.donations?.length || 0} donation{(campaign.donations?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Timeline */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-teal-600">
                          <Calendar className="w-3 h-3" />
                          <span>Ends: {formatDate(campaign.endDate)}</span>
                        </div>
                        <p className="text-xs text-cyan-600">
                          Created: {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(campaign)}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => openPreview(campaign)}
                          className="p-2 rounded-lg bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
                          title="View Campaign"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {status === 'pending_review' && (
                          <>
                            <button 
                              onClick={() => approveOrReject(campaign._id, 'approve')}
                              className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                              title="Approve Campaign"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => approveOrReject(campaign._id, 'reject')}
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              title="Reject Campaign"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        <button 
                          onClick={() => deleteCampaign(campaign._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {campaigns.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center border border-cyan-100">
            <div className="text-teal-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-teal-700 mb-2">No Campaigns Found</h3>
            <p className="text-teal-600">
              {status ? `No campaigns with status "${status}" found.` : 'No campaigns available at the moment.'}
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal for Pending Review Campaigns */}
      {showPreview && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cyan-100">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-teal-800">{selectedCampaign.title}</h2>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-teal-700 mb-2">Campaign Details</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Goal:</strong> ₹{selectedCampaign.goalAmount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Raised:</strong> ₹{(selectedCampaign.raisedAmount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Creator:</strong> {selectedCampaign.creator?.name}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-700 mb-2">Beneficiary</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Name:</strong> {selectedCampaign.beneficiary?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Relationship:</strong> {selectedCampaign.beneficiary?.relationship}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-teal-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedCampaign.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;