import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CampaignCard from '../components/CampaignCard';

const CauseCampaigns = () => {
  const { id } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [causeName, setCauseName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/causes/${id}/campaigns`);
        setCampaigns(res.data.campaigns);
        setCauseName(res.data.cause.name);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [id]);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        ← Back to Causes
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Campaigns under: {causeName}
      </h2>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600">No campaigns found for this cause.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CauseCampaigns;
