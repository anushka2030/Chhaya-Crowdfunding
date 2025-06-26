// src/pages/MyCampaignsPage.jsx
import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCampaigns = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/my-campaigns`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // assuming you're storing JWT token
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch campaigns');
      }

      setCampaigns(data || []);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Campaigns</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">You haven't created any campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign._id} campaign={campaign} showActions={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCampaignsPage;
