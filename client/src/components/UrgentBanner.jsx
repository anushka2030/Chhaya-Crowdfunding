import React, { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';

const UrgentBanner = () => {
  const [urgentCampaign, setUrgentCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrgentCampaign = async () => {
      try {
        setLoading(true);
        // Fetch campaigns with urgent filter, sorted by latest first
      const response = await fetch('${process.env.REACT_APP_API_URL}/campaign/all?status=active&sortBy=createdAt&sortOrder=desc&limit=50');

        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }

        const data = await response.json();
        console.log('Fetched campaigns →', data.campaigns);
        // Find the most recent urgent campaign
        const urgentCampaigns = data.campaigns?.filter(c => c.isUrgent);
const latestUrgentCampaign = urgentCampaigns?.[0]; // now the first urgent in order
console.log("Fetched campaigns →", data.campaigns);
data.campaigns.forEach(c => {
  console.log(`${c.title}: isUrgent →`, c.isUrgent);
});

        
        setUrgentCampaign(latestUrgentCampaign);
      } catch (err) {
        console.error('Error fetching urgent campaign:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrgentCampaign();
  }, []);

  // Helper function to calculate progress percentage
  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Don't render if loading or no urgent campaign found
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-3 mb-6 animate-pulse">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Clock className="h-4 w-4 text-teal-400" />
          </div>
          <div className="ml-2 flex-1">
            <div className="h-3 bg-teal-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !urgentCampaign) {
    return null; // Don't show banner if there's an error or no urgent campaigns
  }

  const progressPercentage = getProgressPercentage(urgentCampaign.raisedAmount, urgentCampaign.goalAmount);

  return (
    <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border border-teal-200 rounded-lg p-2  shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Clock className="h-4 w-4 text-teal-500 animate-pulse flex-shrink-0" />
          
          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 animate-bounce">
              🚨 URGENT
            </span>
            <span className="text-xs text-slate-600 hidden sm:inline">
              {urgentCampaign.cause?.name}
            </span>
          </div>
          
          <div className="flex-1 min-w-0 mx-2">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {truncateText(urgentCampaign.title, 45)}
              {urgentCampaign.beneficiary?.name && (
                <span className="text-teal-600 font-normal">
                  {' '}• Help {urgentCampaign.beneficiary.name}
                </span>
              )}
            </p>
            
            <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
              <span className="flex items-center">
                <Heart className="inline h-3 w-3 mr-1 text-teal-500" />
                {urgentCampaign.donations?.length || 0}
              </span>
              <span className="font-medium text-teal-600">
                {formatCurrency(urgentCampaign.raisedAmount)} / {formatCurrency(urgentCampaign.goalAmount)}
              </span>
              <span className="font-bold text-teal-700">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        
        <a 
          href={`/campaign/${urgentCampaign._id}`}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex-shrink-0"
        >
          Donate Now
        </a>
      </div>
      
      {/* Compact progress bar */}
      <div className="mt-2 w-full bg-teal-100 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UrgentBanner;