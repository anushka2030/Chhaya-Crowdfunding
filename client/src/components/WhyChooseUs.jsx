import React from 'react';
import { Shield, Clock, Users, Check } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Zero Platform Fees",
      description: "100% of donations reach beneficiaries. No hidden charges or platform fees."
    },
    {
      icon: Clock,
      title: "Quick Withdrawals",
      description: "Instant fund transfers to your bank account. No waiting periods."
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to help you."
    },
    {
      icon: Check,
      title: "Verified Campaigns",
      description: "All campaigns are verified for authenticity and transparency."
    }
  ];

  return (
    <div className="py-16 bg-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Chhaya?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;