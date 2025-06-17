import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/campaign/withdrawals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWithdrawals(res.data.withdrawals);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (campaignId, withdrawalId, action) => {
    const transactionId = prompt(`Enter Transaction ID to mark as ${action}:`);
    if (!transactionId) return;

    try {
      await axios.patch(`/api/campaign/withdrawals/${campaignId}/${withdrawalId}`, {
        status: action,
        transactionId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchWithdrawals();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) return <p>Loading withdrawal requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Withdrawal Requests</h1>

      {withdrawals.length === 0 ? (
        <p>No pending withdrawals.</p>
      ) : (
        <div className="grid gap-6">
          {withdrawals.map((w) => (
            <div key={w._id} className="border rounded-lg shadow-md p-5 space-y-2">
              <h2 className="font-semibold text-lg">Campaign: {w.campaignTitle}</h2>
              <p><strong>Amount:</strong> ₹{w.amount}</p>
              <p><strong>Account Holder:</strong> {w.bankDetails.accountHolderName}</p>
              <p><strong>Account Number:</strong> {w.bankDetails.accountNumber}</p>
              <p><strong>IFSC Code:</strong> {w.bankDetails.ifscCode}</p>
              <p><strong>Requested At:</strong> {new Date(w.requestedAt).toLocaleString()}</p>
              <p><strong>Requested By:</strong> {w.creator.name} ({w.creator.email})</p>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleAction(w.campaignId, w._id, 'completed')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(w.campaignId, w._id, 'rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
