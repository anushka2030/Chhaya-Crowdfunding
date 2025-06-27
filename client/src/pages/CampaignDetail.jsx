import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Heart, Clock, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nextImage = () => {
    if (campaign?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === campaign.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (campaign?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? campaign.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!campaign?.images || campaign.images.length <= 1 || !isAutoSliding) return;

    const interval = setInterval(() => {
      nextImage();
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [campaign?.images, isAutoSliding, currentImageIndex]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/campaign/${id}`);
        if (!res.ok) throw new Error('Failed to fetch campaign');
        const data = await res.json();
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
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600 mx-auto mb-3"></div>
          <p className="text-teal-700 font-medium">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-4 text-center border border-stone-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
          <p className="text-red-600 mb-4">{error || 'Campaign not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const daysLeft = getDaysLeft(campaign.endDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-beige-100 to-cyan-900">
      <div className="max-w-6xl mx-auto p-4">
        {/* Main Content - Compact Side by Side Layout */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 border border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            
            {/* Left Side - Image Gallery */}
            <div className="relative">
              <div 
                className="relative w-full h-full min-h-[350px] lg:min-h-[500px] bg-gradient-to-br from-teal-100 to-cyan-100"
                onMouseEnter={() => setIsAutoSliding(false)}
                onMouseLeave={() => setIsAutoSliding(true)}
              >
                {/* Main Image */}
                <img
                  src={campaign.images?.[currentImageIndex]?.url || campaign.images?.[0]?.url}
                  alt={`${campaign.title} - Image ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                {/* Navigation Arrows - Only show if multiple images */}
                {campaign?.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5 text-teal-700" />
                    </button>
                    <button
                      onClick={nextImage}  
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5 text-teal-700" />
                    </button>
                  </>
                )}

                {/* Image Indicators - Only show if multiple images */}
                {campaign?.images?.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {campaign.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-white shadow-md scale-125'
                            : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Auto-slide indicator */}
                {campaign?.images?.length > 1 && isAutoSliding && (
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Auto
                  </div>
                )}
                
                {/* Urgent Badge */}
                {campaign.isUrgent && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 text-xs rounded-full flex items-center shadow-lg animate-pulse">
                    <Clock className="w-3 h-3 mr-1.5" />
                    Urgent
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 shadow-md">
                    <Share2 className="w-4 h-4 text-teal-700" />
                  </button>
                  <button className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 shadow-md">
                    <Bookmark className="w-4 h-4 text-teal-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="p-6 lg:p-8 flex flex-col justify-between">
              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {campaign.title}
                </h1>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {campaign.description}
                </p>

                {/* Campaign Info - Horizontal Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-stone-50 to-amber-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 text-teal-700">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{campaign.donations?.length || 0}</span>
                      <span className="text-gray-600 ml-1">donors</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-teal-700">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{new Date(campaign.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-teal-700">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{campaign.location?.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section - Compact */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 mb-6 border border-teal-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-teal-900 mb-0.5">
                      {formatCurrency(campaign.raisedAmount)}
                    </h3>
                    <p className="text-teal-700 text-xs">of {formatCurrency(campaign.goalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-900 mb-0.5">{progress.toFixed(0)}%</div>
                    <p className="text-teal-700 text-xs">completed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-3">
                  <div className="w-full bg-white h-3 rounded-full shadow-inner border border-teal-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 shadow-sm transition-all duration-700 ease-out relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Days Left */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-teal-700 font-medium">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}
                  </span>
                  <span className="text-teal-600 text-xs">
                    Started {new Date(campaign.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Donate Button */}
              <div className="flex justify-center">
  <button
    onClick={() => navigate(`/campaign/${campaign._id}/donate`)}
    disabled={daysLeft <= 0}
    className={`group px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 transform w-full justify-center lg:w-auto relative overflow-hidden ${
      daysLeft > 0
        ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
  >
    <Heart className="w-5 h-5" />
    {daysLeft > 0 ? 'Donate Now' : 'Campaign Ended'}
    {daysLeft > 0 && (
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    )}
  </button>
</div>

            </div>
          </div>
        </div>

        {/* Additional Campaign Stats - Compact Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-stone-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.donations?.length || 0}</h3>
            <p className="text-gray-600 text-sm">Donors</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-stone-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{progress.toFixed(1)}%</h3>
            <p className="text-gray-600 text-sm">Achieved</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-stone-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{daysLeft}</h3>
            <p className="text-gray-600 text-sm">Days Left</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;