import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Clock, MapPin } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const raised = campaign.raisedAmount || 0;
  const goal = campaign.goalAmount || 1;
  const donors = campaign.donations?.length || 0;
  
  const progressPercentage = (raised / goal) * 100;
  
  // Calculate days remaining
  const daysRemaining = campaign.endDate 
    ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleDonateClick = (e) => {
    e.stopPropagation(); // Prevent card click when donate button is clicked
    navigate(`/campaign/${campaign._id}/donate`);
  };

  const handleCardClick = () => {
    navigate(`/campaign/${campaign._id}`);
  };

  // Get primary image or first image
  // const imageUrl = campaign.images?.find(img => img.isPrimary)?.url || 
  //                  campaign.images?.[0]?.url || 
  //                  campaign.image || 
  //                  'https://via.placeholder.com/400x250.png?text=No+Image';
                   const rawImageUrl = campaign.images?.find(img => img.isPrimary)?.url || 
                    campaign.images?.[0]?.url || 
                    campaign.image || 
                    '';

const imageUrl = rawImageUrl.startsWith('http')
  ? rawImageUrl
  : `https://chhaya-81p3.onrender.com/uploads${rawImageUrl || '/placeholder.jpg'}`; // optional

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-cyan-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden relative border border-amber-100"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
  src={imageUrl}
  alt={campaign.title}
  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
/>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Urgent Badge */}
        {campaign.isUrgent && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center animate-pulse">
            <Clock className="w-3 h-3 mr-1" />
            Urgent
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            campaign.status === 'active' ? 'bg-teal-100 text-teal-800' :
            campaign.status === 'completed' ? 'bg-cyan-100 text-cyan-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
          </span>
        </div>

        {/* Progress Ring */}
        <div className="absolute bottom-4 right-4 w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/30"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-white"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${Math.min(progressPercentage, 100)}, 100`}
              strokeLinecap="round"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {campaign.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {campaign.description}
        </p>

        {/* Location & Creator */}
        {(campaign.location || campaign.creator) && (
          <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
            {campaign.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{campaign.location.city}, {campaign.location.state}</span>
              </div>
            )}
            {campaign.creator?.name && (
              <div className="flex items-center">
                <span>by {campaign.creator.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{raised.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              of ₹{goal.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-teal-100 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-semibold">{donors}</span>
              <span className="ml-1">{donors === 1 ? 'donor' : 'donors'}</span>
            </div>
            
            {daysRemaining > 0 && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-semibold">{daysRemaining}</span>
                <span className="ml-1">{daysRemaining === 1 ? 'day left' : 'days left'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={handleDonateClick}
            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 mx-8 text-white px-7 py-3 rounded-xl text-sm font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate Now
          </button>
          
          {/* <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add share functionality here
            }}
            className="px-4 py-3 border-2 border-amber-200 hover:border-teal-300 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Share
          </button> */}
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default CampaignCard;