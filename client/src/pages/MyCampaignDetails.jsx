import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Heart } from 'lucide-react';

const MyCampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/campaign/${id}`, {
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600">Loading campaign...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!campaign) return null;

  const progress = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{campaign.title}</h1>
      <p className="text-gray-600 mb-4">{campaign.description}</p>

      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <span>Cause: {campaign.cause?.name || 'General'}</span>
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {campaign.donations?.length || 0} Supporters
        </span>
        <span>Status: 
          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'active' ? 'bg-green-100 text-green-700' :
            campaign.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
            campaign.status === 'rejected' ? 'bg-red-100 text-red-700' :
            campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {campaign.status}
          </span>
        </span>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          ₹{campaign.raisedAmount?.toLocaleString() || 0} raised of ₹{campaign.goalAmount?.toLocaleString() || 0}
          {' '}({progress.toFixed(1)}%)
        </p>
      </div>

      {campaign.images && campaign.images.length > 0 && (
        <div className="mb-6">
          <p className="font-medium mb-2">Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {campaign.images.map((img, i) => (
              <div key={i} className="border rounded overflow-hidden">
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.url}`}
                  alt={img.caption || `Image ${i + 1}`}
                  className="w-full h-40 object-cover"
                />
                {img.caption && <p className="text-sm p-2 text-gray-600">{img.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-500">
          End Date: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm text-gray-500">
          Created: {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default MyCampaignDetails;
