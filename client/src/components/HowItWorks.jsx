import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Start Your Campaign",
      description: "Create your fundraiser in minutes with our simple campaign builder."
    },
    {
      step: "2", 
      title: "Share Your Story",
      description: "Tell your story and share it with friends, family, and social networks."
    },
    {
      step: "3",
      title: "Receive Donations",
      description: "Get donations directly to your bank account with instant withdrawals."
    },
    {
      step: "4",
      title: "Keep Supporters Updated",
      description: "Share updates and thank your donors to keep them engaged."
    }
  ];

  return (
    <div className="py-10 bg-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-cyan-950 mb-12">How Chhaya Works?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-teal-800 text-slate-100 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-cyan-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;