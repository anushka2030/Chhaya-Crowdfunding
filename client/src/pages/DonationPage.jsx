// Complete DonationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart, Users, Target, Calendar, Lock, CreditCard, User, MessageSquare,
  ArrowLeft, AlertCircle, Shield, CheckCircle, MapPin, Clock
} from 'lucide-react';

const DonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationData, setDonationData] = useState({
    amount: '',
    customAmount: '',
    message: '',
    isAnonymous: false,
    paymentMethod: 'card'
  });
  const [donationLoading, setDonationLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const predefinedAmounts = [2500, 5000, 10000, 25000, 50000, 100000];

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/campaign/${id}`);
      if (!response.ok) throw new Error('Failed to fetch campaign');
      const data = await response.json();
      setCampaign(data);
      const donations = (data.donations || [])
        .sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt))
        .slice(0, 10)
        .map(d => ({
          id: d._id,
          donor: d.isAnonymous ? 'Anonymous' : d.donor?.name || 'Anonymous',
          amount: d.amount,
          time: formatTimeAgo(d.donatedAt),
          message: d.message
        }));
      setRecentDonations(donations);
    } catch (err) {
      console.error(err);
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const d = new Date(date);
    const hours = Math.floor((now - d) / 36e5);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const handleAmountSelect = amt => setDonationData(d => ({ ...d, amount: amt.toString(), customAmount: '' }));
  const handleCustomAmountChange = e => {
    const val = e.target.value;
    setDonationData(d => ({ ...d, customAmount: val, amount: val }));
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setDonationData(d => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
  };

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('authToken');

  const handleDonate = async () => {
    if (!donationData.amount || parseFloat(donationData.amount) <= 0) return alert('Enter a valid amount');
   if (!getAuthToken()) {
  alert('You must be logged in to proceed with donations!');
  return navigate(`/login?redirect=/campaign/${id}/donate`);
}

    if (campaign.status !== 'active') return alert('Campaign is not accepting donations');

    setDonationLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/campaign/${id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': getAuthToken()
        },
        body: JSON.stringify({
          amount: parseFloat(donationData.amount),
          message: donationData.message,
          isAnonymous: donationData.isAnonymous,
          paymentId: `mock_${Date.now()}`
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);
      alert(`Donation of ₹${donationData.amount} successful!`);
      setCampaign(data.campaign);
      setDonationData({ amount: '', customAmount: '', message: '', isAnonymous: false, paymentMethod: 'card' });
      setShowPayment(false);
      fetchCampaign();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDonationLoading(false);
    }
  };

  const getPrimaryImage = () => {
    if (!campaign?.images?.length) return null;
    const img = campaign.images.find(i => i.isPrimary) || campaign.images[0];
    return `https://chhaya-81p3.onrender.com/uploads${img.url}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-teal-600 text-lg font-medium">Loading campaign...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50">
      <div className="text-center text-red-600 bg-white p-8 rounded-2xl shadow-lg border border-red-100">
        <AlertCircle className="mx-auto mb-4 h-12 w-12" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-beige-50 to-cyan-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-all duration-200 group font-medium"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Campaigns
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 py-8">
        {/* Enhanced Campaign Card */}
        <div className="rounded-3xl shadow-xl bg-white overflow-hidden border border-teal-100 mb-8">
          <div className="relative">
            <img 
              src={getPrimaryImage()} 
              alt={campaign.title} 
              className="w-full h-80 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{campaign.location?.city}, {campaign.location?.state}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">{campaign.title}</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{campaign.description}</p>

            {/* Enhanced Progress Section */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-teal-100">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-3xl font-bold text-teal-800">₹{campaign.raisedAmount?.toLocaleString()}</p>
                  <p className="text-sm text-teal-600 font-medium">raised of ₹{campaign.goalAmount?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-teal-800">
                    {Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-teal-600 font-medium">completed</p>
                </div>
              </div>
              
              <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Enhanced Donation Amount Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {predefinedAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  className={`py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    donationData.amount == amt 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg border-2 border-teal-400' 
                      : 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 hover:from-teal-100 hover:to-cyan-100 border-2 border-teal-200 hover:border-teal-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Enhanced Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  value={donationData.customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom amount"
                  className="w-full pl-10 pr-4 py-4 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 font-medium"
                />
              </div>
            </div>

            {/* Enhanced Message Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                name="message"
                value={donationData.message}
                onChange={handleInputChange}
                placeholder="Share your thoughts or motivation..."
                rows="4"
                className="w-full p-4 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none"
              />
            </div>

            {/* Enhanced Anonymous Checkbox */}
            <label className="flex items-center gap-3 mb-8 cursor-pointer group">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={donationData.isAnonymous}
                onChange={handleInputChange}
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-2 border-teal-300"
              />
              <span className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200 font-medium">
                Donate anonymously
              </span>
            </label>

            {/* Enhanced Donate Button */}
            <button
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              disabled={donationLoading}
            >
              {donationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  Donate {donationData.amount ? `₹${donationData.amount}` : ''}
                </>
              )}
            </button>

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">Secure & Protected</span>
              </div>
              <p className="text-xs text-amber-700">
                Your donation is secured with bank-level encryption and processed through trusted payment gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Donations */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <Heart className="h-6 w-6 text-teal-600" />
            Recent Supporters
          </h3>
          <div className="space-y-4">
            {recentDonations.map((donation, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-200 border border-teal-100">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900">{donation.donor}</p>
                    <p className="font-bold text-teal-700 text-lg">₹{donation.amount}</p>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-2">{donation.time}</p>
                  {donation.message && (
                    <div className="bg-white/70 p-3 rounded-lg border-l-4 border-teal-400">
                      <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;