// src/pages/admin/raised.jsx
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Raised = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchRaised = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/campaigns?limit=1000`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaised();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Total Raised By Campaigns</h1>
      <table className="w-full text-sm bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Campaign</th>
            <th className="p-3">Goal Amount</th>
            <th className="p-3">Raised Amount</th>
            <th className="p-3">Donors</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id} className="border-t border-gray-200">
              <td className="p-3">{c.title}</td>
              <td className="p-3">₹{c.goalAmount?.toLocaleString()}</td>
              <td className="p-3">₹{c.raisedAmount?.toLocaleString()}</td>
              <td className="p-3">{c.donations?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Raised;
