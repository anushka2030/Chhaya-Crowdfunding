import React from 'react';
import { Shield } from 'lucide-react';

const NoPlatformFee = () => {
  return (
    <div className="bg-cyan-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-teal-600 mr-3" />
          <h2 className="text-3xl font-bold text-cyan-800">0% Platform Fee</h2>
        </div>
        <p className="text-lg text-green-700 max-w-2xl mx-auto">
          Unlike other platforms, Chhaya doesn't charge any platform fees. 100% of your donations reach the beneficiaries.
        </p>
      </div>
    </div>
  );
};

export default NoPlatformFee;