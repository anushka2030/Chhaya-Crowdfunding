import React from 'react';

const CampaignCard = ({ campaign }) => {
  const raised = campaign.raised || 0;
  const goal = campaign.goal || 1; // avoid division by 0
  const donors = campaign.donors || 0;

  const progressPercentage = (raised / goal) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={campaign.image || 'https://via.placeholder.com/400x200.png?text=No+Image'}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>₹{raised.toLocaleString()} raised</span>
            <span>₹{goal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{donors} donors</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
