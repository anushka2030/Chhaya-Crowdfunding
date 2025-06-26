import React, { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Target, Users, DollarSign, BarChart3, PieChart, Calendar, Award } from 'lucide-react';

const Raised = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('raisedAmount');
  const [sortOrder, setSortOrder] = useState('desc');

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchRaised = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/campaigns?limit=1000`, {
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

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let aValue = a[sortBy] || 0;
    let bValue = b[sortBy] || 0;
    
    if (sortBy === 'donors') {
      aValue = a.donations?.length || 0;
      bValue = b.donations?.length || 0;
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getTotalStats = () => {
    const totalGoal = campaigns.reduce((sum, c) => sum + (c.goalAmount || 0), 0);
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const totalDonors = campaigns.reduce((sum, c) => sum + (c.donations?.length || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    
    return { totalGoal, totalRaised, totalDonors, activeCampaigns };
  };

  const getRankBadge = (index) => {
    if (index === 0) return { icon: '🥇', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    if (index === 1) return { icon: '🥈', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    if (index === 2) return { icon: '🥉', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { icon: `#${index + 1}`, color: 'text-teal-600 bg-teal-50 border-teal-200' };
  };

  useEffect(() => {
    fetchRaised();
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
          <h3 className="font-semibold mb-2">Error Loading Campaign Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-800">Campaign Fundraising Analytics</h1>

            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600">Total Raised</p>
                <p className="text-2xl font-bold text-teal-800">₹{stats.totalRaised.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">Total Goal</p>
                <p className="text-2xl font-bold text-cyan-800">₹{stats.totalGoal.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Target className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Donors</p>
                <p className="text-2xl font-bold text-emerald-800">{stats.totalDonors.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-800">{stats.activeCampaigns}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-cyan-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-teal-800">Overall Fundraising Progress</h2>
            <span className="text-2xl font-bold text-teal-600">
              {((stats.totalRaised / stats.totalGoal) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${Math.min((stats.totalRaised / stats.totalGoal) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-teal-600">
            <span>₹0</span>
            <span>₹{stats.totalGoal.toLocaleString()}</span>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-100 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-teal-700">Sort by:</span>
            <div className="flex gap-2">
              {[
                { key: 'raisedAmount', label: 'Amount Raised', icon: TrendingUp },
                { key: 'goalAmount', label: 'Goal Amount', icon: Target },
                { key: 'donors', label: 'Donors Count', icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === key
                      ? 'bg-teal-500 text-white'
                      : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {sortBy === key && (
                    <span className="text-xs">
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-cyan-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-500 to-cyan-800 text-white">
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">Campaign</th>
                  <th className="text-right p-4 font-semibold">Goal Amount</th>
                  <th className="text-right p-4 font-semibold">Raised Amount</th>
                  <th className="text-center p-4 font-semibold">Progress</th>
                  <th className="text-center p-4 font-semibold">Donors</th>
                  <th className="text-center p-4 font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map((campaign, index) => {
                  const progress = getProgressPercentage(campaign.raisedAmount || 0, campaign.goalAmount || 1);
                  const rank = getRankBadge(index);
                  
                  return (
                    <tr 
                      key={campaign._id}
                      className={`border-b border-cyan-100 hover:bg-cyan-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-cyan-25/30'
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-4">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${rank.color}`}>
                          {rank.icon}
                        </div>
                      </td>

                      {/* Campaign */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-teal-800 text-sm leading-tight">
                            {campaign.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-teal-600">
                            <Calendar className="w-3 h-3" />
                            <span>Created: {new Date(campaign.createdAt).toLocaleDateString('en-IN')}</span>
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            campaign.status === 'completed' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                      </td>

                      {/* Goal Amount */}
                      <td className="p-4 text-right">
                        <div className="font-bold text-cyan-700">
                          ₹{campaign.goalAmount?.toLocaleString() || '0'}
                        </div>
                      </td>

                      {/* Raised Amount */}
                      <td className="p-4 text-right">
                        <div className="space-y-1">
                          <div className="font-bold text-lg text-teal-700">
                            ₹{(campaign.raisedAmount || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-teal-500">
                            {progress >= 100 ? '🎉 Goal Achieved!' : `₹${((campaign.goalAmount || 0) - (campaign.raisedAmount || 0)).toLocaleString()} to go`}
                          </div>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <span className="text-sm font-bold text-teal-600">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                progress >= 100 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                progress >= 75 ? 'bg-gradient-to-r from-teal-500 to-cyan-500' :
                                progress >= 50 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                                'bg-gradient-to-r from-blue-500 to-indigo-500'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Donors */}
                      <td className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="font-bold text-lg text-emerald-700">
                            {campaign.donations?.length || 0}
                          </div>
                          <div className="text-xs text-emerald-600">
                            {campaign.donations?.length === 1 ? 'donor' : 'donors'}
                          </div>
                        </div>
                      </td>

                      {/* Performance */}
                      <td className="p-4 text-center">
                        <div className="space-y-1">
                          {progress >= 100 && (
                            <div className="flex justify-center">
                              <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                          )}
                          <div className={`text-xs font-medium ${
                            progress >= 90 ? 'text-emerald-600' :
                            progress >= 70 ? 'text-teal-600' :
                            progress >= 50 ? 'text-cyan-600' :
                            progress >= 25 ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {progress >= 90 ? 'Excellent' :
                             progress >= 70 ? 'Great' :
                             progress >= 50 ? 'Good' :
                             progress >= 25 ? 'Fair' : 'Needs Boost'}
                          </div>
                          {(campaign.raisedAmount || 0) > 0 && (
                            <div className="text-xs text-gray-500">
                              Avg: ₹{Math.round((campaign.raisedAmount || 0) / Math.max(campaign.donations?.length || 1, 1)).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {campaigns.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center border border-cyan-100">
            <div className="text-teal-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-teal-700 mb-2">No Campaign Data Available</h3>
            <p className="text-teal-600">
              No campaigns found to analyze fundraising performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Raised;