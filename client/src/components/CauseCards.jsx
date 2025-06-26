import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Users, GraduationCap, Home, Car, TreePine } from 'lucide-react';
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
    <div className="py-10 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
           Choose Your<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-900"> Cause</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a cause that matters to you and help create positive change in the world
          </p>
        </div>

        {/* Cause Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {causes.map((cause, index) => {
            const IconComponent = iconMap[cause.icon] || Heart;
            return (
              <div
                key={cause._id}
                onClick={() => handleCauseClick(cause._id)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${cause.color}20, ${cause.color}40)`
                  }}
                />
                
                {/* Card Content */}
                <div className="relative p-6 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div 
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: `${cause.color}15`,
                        border: `2px solid ${cause.color}30`
                      }}
                    >
                      <IconComponent 
                        className="h-8 w-8 transition-all duration-300" 
                        style={{ color: cause.color }} 
                      />
                    </div>
                    
                    {/* Floating dot indicator */}
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
                      style={{ backgroundColor: cause.color }}
                    />
                  </div>

                  {/* Cause Name */}
                  <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-gray-800 transition-colors">
                    {cause.name}
                  </h3>
                  
                  {/* Campaign Count */}
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-gray-800">
                      {cause.campaigns?.length || 0}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {(cause.campaigns?.length || 0) === 1 ? 'campaign' : 'campaigns'}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: cause.color,
                        width: `${Math.min(((cause.campaigns?.length || 0) / 10) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div 
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-opacity-50 transition-all duration-300"
                  style={{ borderColor: cause.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CauseCards;