import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CampaignCard from './CampaignCard';
import axios from 'axios';

const TopCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/campaign/all?limit=3&sortBy=createdAt&sortOrder=desc`);
        const data = res.data;

        if (Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
        } else {
          console.warn("Expected campaigns array but got:", data);
          setCampaigns([]);
        }
      } catch (err) {
        console.error('Error fetching top campaigns:', err);
        setCampaigns([]);
      }
    };

    fetchTopCampaigns();
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Campaigns</h2>
          <button
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            onClick={() => navigate('/campaigns')}
          >
            View more campaigns <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(campaigns) && campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCampaigns;
