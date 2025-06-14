import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, CreditCard } from 'lucide-react';

const PricingCalculator = () => {
  const [targetAmount, setTargetAmount] = useState('');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const calculateAmounts = (target) => {
    if (!target || target <= 0) return null;

    const targetNum = parseFloat(target);
    const gatewayFeeRate = 0.07; // 7%

    const totalNeeded = targetNum / (1 - gatewayFeeRate);
    const gatewayFees = totalNeeded * gatewayFeeRate;
    const netAmount = totalNeeded - gatewayFees;

    return {
      targetAmount: targetNum,
      totalNeeded: Math.ceil(totalNeeded),
      gatewayFees: Math.ceil(gatewayFees),
      netAmount: Math.ceil(netAmount),
    };
  };

  useEffect(() => {
    if (targetAmount) {
      const calculated = calculateAmounts(targetAmount);
      setResults(calculated);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [targetAmount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-[#077A7D] to-[#06202B]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Calculator className="w-12 h-12 text-[#7AE2CF]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-light text-white mb-4 tracking-tight">
            Funding Calculator
          </h1>
          <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
            Calculate the exact amount you need to raise to reach your goal after payment gateway fees
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-[#7AE2CF]/20">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-[#06202B] mb-4">
              What's your fundraising goal?
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#077A7D] font-semibold text-lg">
                ₹
              </div>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Enter your target amount"
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#7AE2CF] focus:ring-4 focus:ring-[#7AE2CF]/10 outline-none transition-all duration-300"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter the amount you actually need for your cause
            </p>
          </div>

          {/* Results Section */}
          {showResults && results && (
            <div className={`transition-all duration-500 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Highlight Card */}
              <div className="bg-teal-100 rounded-2xl p-6 mb-8 text-center">
                <h3 className="text-lg font-medium text-[#06202B] mb-2">
                  Amount You Should Raise
                </h3>
                <div className="text-4xl font-bold text-[#06202B] mb-2">
                  {formatCurrency(results.totalNeeded)}
                </div>
                <p className="text-[#06202B]/70 text-sm">
                  To receive {formatCurrency(results.targetAmount)} after all fees
                </p>
              </div>

              {/* Breakdown Cards */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#06202B]/5 to-[#077A7D]/5 rounded-xl p-6 border border-[#7AE2CF]/30">
                  <div className="flex items-center mb-3">
                    <CreditCard className="w-5 h-5 text-[#077A7D] mr-2" />
                    <h4 className="font-medium text-[#06202B]">Payment Gateway Fees</h4>
                  </div>
                  <div className="text-2xl font-bold text-[#077A7D] mb-1">
                    {formatCurrency(results.gatewayFees)}
                  </div>
                  <p className="text-sm text-gray-600">7% of total raised</p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-medium text-[#06202B] mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Detailed Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Total Amount to Raise</span>
                    <span className="font-semibold text-[#06202B]">{formatCurrency(results.totalNeeded)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Less: Payment Gateway Fees (7%)</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(results.gatewayFees)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-[#7AE2CF]/20 rounded-lg px-4 font-semibold text-lg">
                    <span className="text-[#06202B]">Amount You'll Receive</span>
                    <span className="text-[#077A7D]">{formatCurrency(results.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Note:</strong> Payment gateway fees are standard charges for processing online donations.
                  Platform fees may vary depending on your chosen fundraising platform.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Make informed decisions about your fundraising goals
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
