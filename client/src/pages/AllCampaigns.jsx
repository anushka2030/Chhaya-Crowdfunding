import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Calendar, Heart, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';

const AllCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, sortBy, selectedCause, selectedLocation]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        sortBy,
        sortOrder: 'desc'
      });
      if (selectedCause !== 'all') params.append('cause', selectedCause);
      if (selectedLocation.trim()) params.append('location', selectedLocation.trim());
      const response = await fetch(`http://localhost:5000/api/campaign/all?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCampaigns(data.campaigns || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (raised, goal) => Math.min((raised / goal) * 100, 100);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCampaignClick = (id) => window.location.href = `/campaign/${id}`;
  const handleDonateClick = (e, id) => {
    e.stopPropagation();
    window.location.href = `/campaign/${id}/donate`;
  };

  const CampaignCard = ({ campaign }) => {
    const progress = calculateProgress(campaign.raisedAmount || 0, campaign.goalAmount);
    const daysLeft = getDaysLeft(campaign.endDate);
    const imgUrl = campaign.images?.[0]?.url ? encodeURI(`http://localhost:5000${campaign.images[0].url}`) : '/api/placeholder/400/250';
    const profileUrl = campaign.creator?.profilePicture ? encodeURI(`http://localhost:5000${campaign.creator.profilePicture}`) : '/api/placeholder/32/32';

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer" onClick={() => handleCampaignClick(campaign._id)}>
        <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
          <img src={imgUrl} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.onerror = null; e.target.src = '/api/placeholder/400/250'; }} />
          {campaign.isUrgent && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Urgent
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium" style={{ color: campaign.cause?.color || '#077A7D' }}>
            {campaign.cause?.icon || '📋'} {campaign.cause?.name || 'General'}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#077A7D] transition-colors">{campaign.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

          <div className="flex items-center mb-4">
            <img src={profileUrl} alt={campaign.creator?.name || 'Anonymous'} className="w-8 h-8 rounded-full mr-3" onError={(e) => { e.target.onerror = null; e.target.src = '/api/placeholder/32/32'; }} />
            <div>
              <p className="text-sm font-medium text-gray-900">{campaign.creator?.name || 'Anonymous'}</p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" /> {campaign.location?.city}, {campaign.location?.state}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">{formatCurrency(campaign.raisedAmount || 0)} raised</span>
              <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#077A7D] to-[#7AE2CF] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
              <span>{daysLeft} days left</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center"><Users className="w-4 h-4 mr-1" /> {campaign.donations?.length || 0} donors</div>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(campaign.createdAt).toLocaleDateString()}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={(e) => handleDonateClick(e, campaign._id)} className="flex-1 bg-gradient-to-r from-[#077A7D] to-[#7AE2CF] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center group">
              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Donate Now
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleCampaignClick(campaign._id); }} className="px-4 py-3 border-2 border-[#7AE2CF] text-[#077A7D] rounded-xl font-medium hover:bg-[#7AE2CF]/10 transition-all duration-300 flex items-center">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-light text-[#06202B] mb-4 tracking-tight">All Campaigns</h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">Discover meaningful causes and make a difference in someone's life</p>
        </div>

        {/* Filters
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#7AE2CF] focus:ring-2 focus:ring-[#7AE2CF]/20 outline-none" />
            </div>
            <select value={selectedCause} onChange={(e) => setSelectedCause(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#7AE2CF] focus:ring-2 focus:ring-[#7AE2CF]/20 outline-none">
              <option value="all">All Causes</option>
              <option value="medical">Medical</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="disaster">Disaster Relief</option>
            </select>
            <input type="text" placeholder="Filter by location..." value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#7AE2CF] focus:ring-2 focus:ring-[#7AE2CF]/20 outline-none" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#7AE2CF] focus:ring-2 focus:ring-[#7AE2CF]/20 outline-none">
              <option value="createdAt">Newest First</option>
              <option value="raisedAmount">Most Funded</option>
              <option value="goalAmount">Highest Goal</option>
              <option value="endDate">Ending Soon</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={fetchCampaigns} className="px-6 py-2 bg-[#077A7D] text-white rounded-lg hover:bg-[#066064] transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Apply Filters
            </button>
          </div>
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error} <button onClick={fetchCampaigns} className="ml-2 underline hover:no-underline">Try again</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4"><TrendingUp className="w-16 h-16 mx-auto" /></div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">{searchQuery ? 'No campaigns match your search' : 'No campaigns found'}</h3>
                  <p className="text-gray-500">{searchQuery ? 'Try adjusting your search terms' : 'Try adjusting your filters or check back later'}</p>
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign._id} campaign={campaign} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Previous</button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-4 py-2 rounded-lg ${currentPage === pageNum ? 'bg-[#7AE2CF] text-[#06202B] font-medium' : 'border border-gray-200 hover:bg-gray-50'}`}>{pageNum}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllCampaigns;
