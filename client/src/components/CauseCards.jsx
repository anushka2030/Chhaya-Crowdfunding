import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Heart, Users, GraduationCap, Home, Car, TreePine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  Heart,
  Users,
  GraduationCap,
  Home,
  Car,
  TreePine,
};

const CauseCards = () => {
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/causes/get-causes');
        setCauses(res.data);
      } catch (err) {
        console.error('Failed to fetch causes:', err);
      }
    };
    fetchCauses();
  }, []);

  const handleCauseClick = (causeId) => {
    navigate(`/cause/${causeId}`);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse by Cause</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {causes.map((cause) => {
            const IconComponent = iconMap[cause.icon] || Heart;
            return (
              <div
                key={cause._id}
                onClick={() => handleCauseClick(cause._id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
              >
                <IconComponent className="h-12 w-12 mx-auto mb-4" style={{ color: cause.color }} />
                <h3 className="font-semibold text-gray-900 mb-2">{cause.name}</h3>
                <p className="text-sm text-gray-600">{cause.campaigns?.length || 0} campaigns</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CauseCards;
