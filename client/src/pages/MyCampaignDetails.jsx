import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Heart, Calendar, Target, TrendingUp } from 'lucide-react';

const MyCampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}'}/campaign/${id}`, {
          headers: { 'x-auth-token': getAuthToken() }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to load campaign');
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
          <span className="block mt-4 text-gray-700 font-medium">Loading campaign...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const progress = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-cyan-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                {campaign.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{campaign.description}</p>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full">
                  <Target className="h-4 w-4 text-teal-600" />
                  <span className="font-medium text-gray-700">{campaign.cause?.name || 'General'}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full">
                  <Heart className="h-4 w-4 text-teal-600" />
                  <span className="font-medium text-gray-700">{campaign.donations?.length || 0} Supporters</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    campaign.status === 'active' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' :
                    campaign.status === 'pending_review' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
                    campaign.status === 'rejected' ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg' :
                    campaign.status === 'completed' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg' :
                    'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-cyan-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Fundraising Progress</h2>
              <p className="text-gray-600">Track your campaign's success</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-6 shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 h-6 rounded-full shadow-lg transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  ₹{campaign.raisedAmount?.toLocaleString() || 0}
                </span>
                <span className="text-gray-500 font-medium">raised of</span>
                <span className="text-xl font-semibold text-gray-700">
                  ₹{campaign.goalAmount?.toLocaleString() || 0}
                </span>
              </div>
              
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full">
                <span className="text-lg font-bold text-teal-700">{progress.toFixed(1)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Images Card */}
        {campaign.images && campaign.images.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-cyan-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaign.images.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-cyan-100 to-teal-100">
                    <img
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.url}`}
                      alt={img.caption || `Image ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-cyan-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Campaign Timeline</h2>
              <p className="text-gray-600">Important dates and milestones</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200">
              <h3 className="font-semibold text-gray-800 mb-2">Campaign End Date</h3>
              <p className="text-lg font-medium text-teal-700">
                {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No end date set'}
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200">
              <h3 className="font-semibold text-gray-800 mb-2">Created On</h3>
              <p className="text-lg font-medium text-teal-700">
                {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not available'}
              </p>
            </div>
          </div>
        </div>
        {(campaign.raisedAmount > 0 && ['completed', 'paused'].includes(campaign.status)) && (
  <div className="text-center mt-8">
    <button
      onClick={() => window.location.href = `/campaign/${campaign._id}/withdraw`}
      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl shadow-md hover:from-rose-600 hover:to-rose-700 transition-all duration-300"
    >
      Request Withdrawal
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default MyCampaignDetails;