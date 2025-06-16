// src/pages/admin/campaigns.jsx
import React, { useEffect, useState } from 'react';
import { Eye, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/campaigns${status ? `?status=${status}` : ''}`, {
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

  const approveOrReject = async (id, action) => {
    try {
      await fetch(`${baseURL}/admin/campaigns/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ verificationNotes: `${action} by admin` })
      });
      fetchCampaigns();
    } catch (err) {
      alert('Action failed');
    }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await fetch(`${baseURL}/admin/delete-campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      fetchCampaigns();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">{status ? `${status} Campaigns` : 'All Campaigns'}</h1>
      <table className="w-full text-sm bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Creator</th>
            <th className="p-3">Goal</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id} className="border-t border-gray-200">
              <td className="p-3">{c.title}</td>
              <td className="p-3">{c.creator?.name || 'N/A'}</td>
              <td className="p-3">₹{c.goalAmount?.toLocaleString()}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => window.open(`/campaign/${c._id}`, '_blank')} className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <Eye className="h-4 w-4" />
                </button>
                {status === 'pending_review' && (
                  <>
                    <button onClick={() => approveOrReject(c._id, 'approve')} className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button onClick={() => approveOrReject(c._id, 'reject')} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button onClick={() => deleteCampaign(c._id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Campaigns;
