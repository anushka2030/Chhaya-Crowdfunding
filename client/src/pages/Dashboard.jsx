
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  Clock, 
  XCircle,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Bell,
  Filter,
  Search,
  MoreVertical,
  Loader2,
  X,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showCampaigns, setShowCampaigns] = useState(false);

    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);
  const [showDonationsModal, setShowDonationsModal] = useState(false);
  const [showSupportedModal, setShowSupportedModal] = useState(false);
  const [showRaisedModal, setShowRaisedModal] = useState(false);
  const [showWithdrawalsModal, setShowWithdrawalsModal] = useState(false);
  
  // Modal data
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [supportedCampaigns, setSupportedCampaigns] = useState([]);
  const [raisedData, setRaisedData] = useState([]);
  const [withdrawalData, setWithdrawalData] = useState([]);
  
  // Upload state
  const [uploading, setUploading] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const baseURL = process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}';
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }
      
      return data;
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err);
      throw err;
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const userData = await apiCall('/user/own-profile');
      setUser(userData);
    } catch (err) {
      setError('Failed to fetch user profile');
    }
  };

  // Fetch user's campaigns
  const fetchUserCampaigns = async () => {
    try {
      const campaignsData = await apiCall('/campaign/user/my-campaigns');
      setCampaigns(campaignsData);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setCampaigns([]);
    }
  };

  // Fetch admin stats
  const fetchAdminStats = async () => {
    try {
      const stats = await apiCall('/admin/stats');
      setAdminStats(stats);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // Fetch admin campaigns
  const fetchAdminCampaigns = async () => {
    try {
      const allCampaigns = await apiCall('/admin/campaigns?status=pending_review&limit=10');
      setPendingCampaigns(allCampaigns.campaigns || []);
    } catch (err) {
      console.error('Failed to fetch admin campaigns:', err);
    }
  };

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      const usersData = await apiCall('/admin/users?limit=10');
      setUsers(usersData.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  // Fetch withdrawal requests
  const fetchWithdrawals = async () => {
    try {
      const withdrawalsData = await apiCall('/admin/withdrawals?limit=5');
      setWithdrawals(withdrawalsData.withdrawals || []);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    }
  };

  // Fetch detailed user campaigns for modal
  const fetchDetailedCampaigns = async () => {
    try {
      const campaignsData = await apiCall('/campaign/user/my-campaigns');
      setUserCampaigns(campaignsData);
    } catch (err) {
      console.error('Failed to fetch detailed campaigns:', err);
    }
  };

  // Fetch user donations
  const fetchUserDonations = async () => {
    try {
      const donationsData = await apiCall('/user/my-donations');
      setUserDonations(donationsData);
    } catch (err) {
      console.error('Failed to fetch user donations:', err);
    }
  };

  // Fetch supported campaigns (campaigns user donated to)
  const fetchSupportedCampaigns = async () => {
  try {
    const donationsData = await apiCall('/user/my-donations');

    const campaignMap = new Map();

    donationsData.forEach(donation => {
      if (!campaignMap.has(donation.campaignId)) {
        campaignMap.set(donation.campaignId, {
          id: donation.campaignId,
          title: donation.campaignTitle,
          cause: donation.cause,
          totalDonated: 0,
          donationCount: 0,
          latestDonationDate: donation.donatedAt // Initialize with first donation
        });
      }

      const campaign = campaignMap.get(donation.campaignId);
      campaign.totalDonated += donation.amount;
      campaign.donationCount += 1;

      // Update to the latest date
      const newDate = new Date(donation.donatedAt);
      const currentLatest = new Date(campaign.latestDonationDate);
      if (newDate > currentLatest) {
        campaign.latestDonationDate = donation.donatedAt;
      }
    });

    setSupportedCampaigns(Array.from(campaignMap.values()));
  } catch (err) {
    console.error('Failed to fetch supported campaigns:', err);
  }
};


  // Fetch raised data
  const fetchRaisedData = async () => {
    try {
      const data = await apiCall('/user/my-total-raised');
      setRaisedData(data.campaigns || []);
    } catch (err) {
      console.error('Failed to fetch raised data:', err);
    }
  };

  // Fetch withdrawal data
  const fetchWithdrawalData = async () => {
    try {
      const data = await apiCall('/user/my-withdrawals');
      setWithdrawalData(data);
    } catch (err) {
      console.error('Failed to fetch withdrawal data:', err);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}'}/user/upload-avatar`, {
        method: 'POST',
        headers: {
          'x-auth-token': getAuthToken()
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      // Update user profile picture
      setUser(prev => ({ ...prev, profilePicture: data.profilePicture }));
      setShowAvatarModal(false);
      
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle campaign approval
  const handleCampaignApproval = async (campaignId, action, notes = '') => {
    try {
      await apiCall(`/admin/campaigns/${campaignId}/${action}`, {
        method: 'PATCH',
        body: JSON.stringify({ verificationNotes: notes })
      });
      
      // Refresh pending campaigns
      fetchAdminCampaigns();
      fetchAdminStats();
    } catch (err) {
      alert(`Failed to ${action} campaign: ${err.message}`);
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await apiCall(`/campaign/${campaignId}`, {
        method: 'DELETE'
      });
      
      // Refresh campaigns
      if (user?.role === 'admin') {
        fetchAdminCampaigns();
        fetchAdminStats();
      } else {
        fetchUserCampaigns();
      }
    } catch (err) {
      alert(`Failed to delete campaign: ${err.message}`);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserProfile();
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch role-specific data when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchRoleData = async () => {
      if (user.role === 'admin') {
        await Promise.all([
          fetchAdminStats(),
          fetchAdminCampaigns(),
          fetchAdminUsers(),
          fetchWithdrawals()
        ]);
      } else {
        await fetchUserCampaigns();
      }
    };

    fetchRoleData();
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, change, color = 'teal', loading = false, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <p className={`text-sm ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'} mt-1`}>
                  {change}
                </p>
              )}
            </>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const CampaignCard = ({ campaign, showActions = false, isAdmin = false }) => {
    const progress = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;
  
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{campaign.title}</h3>
              {campaign.isUrgent && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{campaign.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {campaign.cause?.icon || '📁'} {campaign.cause?.name || 'General'}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {campaign.donations?.length || 0} supporters
              </span>
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-1 ml-4">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
               onClick={() => navigate(`/my-campaign/${campaign._id}`)}

              >
                <Eye className="h-4 w-4 text-gray-500" />
              </button>
              {!isAdmin && (
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => window.location.href = `/update-campaign/${campaign._id}`}
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <button 
                className="p-2 hover:bg-red-100 rounded-lg"
                onClick={() => handleDeleteCampaign(campaign._id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">₹{campaign.raisedAmount?.toLocaleString() || 0} / ₹{campaign.goalAmount?.toLocaleString() || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{progress.toFixed(1)}% funded</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              campaign.status === 'active' ? 'bg-green-100 text-green-700' :
              campaign.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
              campaign.status === 'rejected' ? 'bg-red-100 text-red-700' :
              campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {campaign.status?.replace('_', ' ') || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Modal Components
  const AvatarModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Profile Picture</h3>
          <button onClick={() => setShowAvatarModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAvatarUpload(e.target.files[0])}
            className="w-full p-2 border rounded"
            disabled={uploading}
          />
        </div>
        {uploading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );

  const CampaignsModal = () => (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">My Campaigns</h3>
          <button onClick={() => setShowCampaignsModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Goal</th>
                <th className="text-left p-3">Raised</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userCampaigns.map(campaign => (
                <tr key={campaign._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{campaign.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                      campaign.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">₹{campaign.goalAmount?.toLocaleString()}</td>
                  <td className="p-3">₹{campaign.raisedAmount?.toLocaleString()}</td>
                  <td className="p-3">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() =>  navigate(`/my-campaign/${campaign._id}`)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => window.location.href = `/update-campaign/${campaign._id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={() => handleDeleteCampaign(campaign._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const DonationsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">My Donations</h3>
          
          <button onClick={() => setShowDonationsModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Campaign</th>
                <th className="text-left p-3">Cause</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {userDonations.map((donation, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => window.open(`/campaign/${donation.campaignId}`, '_blank')}
                    >
                      {donation.campaignTitle}
                    </button>
                  </td>
                  <td className="p-3">{donation.cause}</td>
                  <td className="p-3">₹{donation.amount.toLocaleString()}</td>
                  <td className="p-3">

  {!isNaN(new Date(donation.donatedAt)) 
    ? new Date(donation.donatedAt).toLocaleDateString() 
    : 'Invalid Date'}
</td>

                  <td className="p-3">{donation.message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SupportedModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Campaigns Supported</h3>
          <button onClick={() => setShowSupportedModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4">
          {supportedCampaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <button 
                    className="text-lg font-medium text-blue-600 hover:underline"
                    onClick={() => window.location.href = `/campaign/${campaign.id}`}

                  >
                    {campaign.title}
                  </button>
                  <p className="text-sm text-gray-600">{campaign.cause}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{campaign.totalDonated.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{campaign.donationCount} donation{campaign.donationCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RaisedModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Money Raised by Campaign</h3>
          <button onClick={() => setShowRaisedModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Campaign</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Goal</th>
                <th className="text-left p-3">Raised</th>
                <th className="text-left p-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {raisedData.map(campaign => (
                <tr key={campaign._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{campaign.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-3">₹{campaign.goalAmount?.toLocaleString()}</td>
                  <td className="p-3">₹{campaign.raisedAmount?.toLocaleString()}</td>
                  <td className="p-3">
                    {campaign.goalAmount > 0 ? ((campaign.raisedAmount / campaign.goalAmount) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const WithdrawalsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Withdrawal History</h3>
          <button onClick={() => setShowWithdrawalsModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Campaign</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Account</th>
                <th className="text-left p-3">Requested</th>
                <th className="text-left p-3">Process</th>
                <th className="text-left p-3">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalData.map((withdrawal, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{withdrawal.campaignTitle}</td>
                  <td className="p-3">₹{withdrawal.amount?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                      withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="p-3">{withdrawal.bankDetails?.accountNumber ? `****${withdrawal.bankDetails.accountNumber.slice(-4)}` : '-'}</td>
                  <td className="p-3">{new Date(withdrawal.requestedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {withdrawal.processedAt && !isNaN(new Date(withdrawal.processedAt))
                      ? new Date(withdrawal.processedAt).toLocaleDateString()
                      : 'Pending'}
                  </td>
                  <td className="p-3">{withdrawal.transactionId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

 const UserDashboard = () => (

  <div className="space-y-6">
    
    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard 
        icon={Heart} 
        title="Campaigns Created" 
        value={user?.stats?.campaignsCreated || 0} 
        color="teal"
        onClick={() => {
          fetchDetailedCampaigns();
          setShowCampaignsModal(true);
        }}
      />
      <StatCard 
        icon={DollarSign} 
        title="Total Donated" 
        value={`₹${(user?.stats?.totalDonated || 0).toLocaleString()}`} 
        color="cyan"
        onClick={() => {
          fetchUserDonations();
          setShowDonationsModal(true);
        }}
      />
      <StatCard 
        icon={Users} 
        title="Campaigns Supported" 
        value={supportedCampaigns.length || 0} 
        color="blue"
        onClick={() => {
          fetchSupportedCampaigns();
          setShowSupportedModal(true);
        }}
      />
      <StatCard 
        icon={TrendingUp} 
        title="Total Raised" 
        value={`₹${raisedData.reduce((sum, c) => sum + (c.raisedAmount || 0), 0).toLocaleString()}`} 
        color="violet"
        onClick={() => {
          fetchRaisedData();
          setShowRaisedModal(true);
        }}
      />
      <StatCard 
        icon={Activity} 
        title="Withdrawals" 
        value={withdrawalData.length || 0} 
        color="rose"
        onClick={() => {
          fetchWithdrawalData();
          setShowWithdrawalsModal(true);
        }}
      />
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-colors"
          onClick={() => window.location.href = '/start-fundraiser'}
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => window.location.href = '/campaigns'}
        >
          <Search className="h-4 w-4" />
          Browse Campaigns
        </button>
        
      </div>
    </div>

    {/* My Campaigns Preview */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold text-gray-900">My Campaigns</h2>
  </div>

  {campaigns.length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p>No campaigns created yet</p>
      <button 
        className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
        onClick={() => window.location.href = '/start-fundraiser'}
      >
        Create your first campaign
      </button>
    </div>
  ) : (
    <>
      <button
        onClick={() => setShowCampaigns(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-colors"
      >
        {showCampaigns ? 'Hide My Campaigns' : 'Show My Campaigns'}
      </button>

      {showCampaigns && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign._id} campaign={campaign} showActions={true} />
          ))}
        </div>
      )}
    </>
  )}
</div>


    {/* Modals */}
    {showAvatarModal && <AvatarModal />}
    {showCampaignsModal && <CampaignsModal />}
    {showDonationsModal && <DonationsModal />}
    {showSupportedModal && <SupportedModal />}
    {showRaisedModal && <RaisedModal />}
    {showWithdrawalsModal && <WithdrawalsModal />}
  </div>
);


  const AdminDashboard = () => (
     <div className="space-y-6">
    {/* Admin Stats (Clickable Stat Cards) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div onClick={() => window.location.href = '/admin/users'} className="cursor-pointer">
        <StatCard icon={Users} title="Total Users" value={adminStats?.totalUsers?.toLocaleString() || 0} color="teal" loading={!adminStats} />
      </div>
      <div onClick={() => window.location.href = '/admin/campaigns'} className="cursor-pointer">
        <StatCard icon={Heart} title="Total Campaigns" value={adminStats?.totalCampaigns || 0} color="cyan" loading={!adminStats} />
      </div>
      <div onClick={() => window.location.href = '/admin/campaigns?status=active'} className="cursor-pointer">
        <StatCard icon={CheckCircle} title="Active Campaigns" value={adminStats?.activeCampaigns || 0} color="teal" loading={!adminStats} />
      </div>
      <div onClick={() => window.location.href = '/admin/campaigns?status=pending_review'} className="cursor-pointer">
        <StatCard icon={Clock} title="Pending Review" value={adminStats?.pendingCampaigns || 0} color="yellow" loading={!adminStats} />
      </div>
      <div onClick = {()=>window.location.href = '/admin/raised'} className = "cursor-pointer">
             <StatCard 
  icon={DollarSign}
  title="Total Raised"
  value={
    adminStats
      ? adminStats.totalRaised >= 1_000_000
        ? `₹${(adminStats.totalRaised / 1_000_000).toFixed(1)}M`
        : `₹${adminStats.totalRaised.toLocaleString()}`
      : '₹0'
  }
  color="cyan"
  loading={!adminStats}
/>
      </div>
 

      <div onClick={() => window.location.href = '/admin/causes'} className="cursor-pointer">
        <StatCard icon={Activity} title="Active Causes" value={adminStats?.totalCauses || 0} color="teal" loading={!adminStats} />
      </div>
    </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Pending Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                  {adminStats?.pendingCampaigns || 0}
                </span>
                <button 
                  className="text-yellow-700 hover:text-yellow-800"
                  onClick={() => window.location.href = '/admin/campaigns?status=pending_review'}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">Withdrawal Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {withdrawals.length}
                </span>
                <button 
                  className="text-red-700 hover:text-red-800"
                  onClick={() => window.location.href = '/admin/withdrawals'}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-teal-600" />
                <span className="font-medium text-teal-900">Total Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                  {adminStats?.totalUsers || 0}
                </span>
                <button 
                  className="text-teal-700 hover:text-teal-800"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-cyan-600" />
                <span className="font-medium text-cyan-900">Active Causes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm font-medium">
                  {adminStats?.totalCauses || 0}
                </span>
                <button 
                  className="text-cyan-700 hover:text-cyan-800"
                  onClick={() => window.location.href = '/admin/causes'}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns for Review */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Campaigns Pending Review</h2>


        </div>
        {pendingCampaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No campaigns pending review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Creator</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Goal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCampaigns.map(campaign => (
                  <tr key={campaign._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">{campaign.title}</p>
                          <p className="text-sm text-gray-500">{campaign.cause?.name || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-700">{campaign.creator?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">₹{campaign.goalAmount?.toLocaleString() || 0}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button 
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                          onClick={() => handleCampaignApproval(campaign._id, 'approve')}
                        >
                          Approve
                        </button>
                        <button 
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                          onClick={() => handleCampaignApproval(campaign._id, 'reject')}
                        >
                          Reject
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => window.location.href = `/campaign/${campaign._id}`}
  >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

   useEffect(() => {
    fetchSupportedCampaigns();
    fetchRaisedData();
    fetchWithdrawalData();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              {/* <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-teal-100 text-teal-700'
              }`}>
                {user?.role || 'user'}
              </span> */}
            </div>
            <div className="flex items-center gap-4">
              {/* <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button> */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img 
                      src={`https://chhaya-81p3.onrender.com/uploads${user.profilePicture}`} 
                      
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;