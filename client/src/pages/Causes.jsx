// src/pages/admin/causes.jsx
import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';

const Causes = () => {
  const [causes, setCauses] = useState([]);
  const [newCause, setNewCause] = useState({ name: '', description: '', icon: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchCauses = async () => {
    try {
      const res = await fetch(`${baseURL}/causes/get-causes`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCauses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCause = async () => {
    try {
      const res = await fetch(`${baseURL}/causes/create-cause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newCause)
      });
      if (!res.ok) throw new Error('Creation failed');
      setNewCause({ name: '', description: '', icon: '' });
      fetchCauses();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCause = async (id) => {
    if (!window.confirm('Delete this cause?')) return;
    try {
      const res = await fetch(`${baseURL}/causes/delete-cause/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchCauses();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Causes</h1>

      <div className="flex gap-4">
        <input
          className="border px-3 py-2 rounded w-1/4"
          placeholder="Name"
          value={newCause.name}
          onChange={(e) => setNewCause({ ...newCause, name: e.target.value })}
        />
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Description"
          value={newCause.description}
          onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
        />
        <input
          className="border px-3 py-2 rounded w-1/5"
          placeholder="Icon"
          value={newCause.icon}
          onChange={(e) => setNewCause({ ...newCause, icon: e.target.value })}
        />
        <button
          onClick={createCause}
          className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Plus className="h-4 w-4" /> Create
        </button>
      </div>

      <table className="w-full text-sm bg-white border border-gray-200 mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3">Icon</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {causes.map((cause) => (
            <tr key={cause._id} className="border-t border-gray-200">
              <td className="p-3">{cause.name}</td>
              <td className="p-3">{cause.description}</td>
              <td className="p-3">{cause.icon}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteCause(cause._id)}
                  className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
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

export default Causes;
