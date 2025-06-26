import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RequestWithdrawalPage = () => {
  const { id } = useParams(); // campaign ID
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getToken = () => localStorage.getItem('token');

  // Fetch campaign to show raisedAmount and withdrawals
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/campaign/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to load campaign');
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCampaign();
  }, [id]);

  const availableAmount = campaign
    ? campaign.raisedAmount - (campaign.totalWithdrawn || 0)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return alert('Enter a valid amount');
    if (amount > availableAmount) return alert('Withdrawal exceeds available funds');

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/campaign/${id}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': getToken()
        },
        body: JSON.stringify({
          amount,
          ...bankDetails
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Withdrawal failed');
      setSuccessMsg(data.msg);
      setAmount('');
      setBankDetails({ accountNumber: '', ifscCode: '', accountHolderName: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Campaign</h3>
            <p className="text-red-600 font-medium mb-6">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 px-8 py-12 relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-2">Request Withdrawal</h2>
              <p className="text-teal-100 text-lg">Withdraw your campaign funds securely</p>
            </div>
          </div>

          <div className="p-8">
            {/* Campaign Info Card */}
            {campaign && (
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-2xl border border-cyan-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Campaign Name</p>
                    <p className="text-lg font-semibold text-gray-800">{campaign.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Available Funds</p>
                    <p className="text-2xl font-bold text-teal-700">₹{availableAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 p-6 rounded-2xl mb-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Success!</h4>
                    <p className="text-green-700">{successMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Withdrawal Amount</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">₹</span>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-4 text-lg font-semibold focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-2xl border border-cyan-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Bank Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white"
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                        placeholder="Enter IFSC code"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="order-2 sm:order-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="order-1 sm:order-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestWithdrawalPage;