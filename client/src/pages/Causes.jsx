// src/pages/admin/causes.jsx
import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Loader2, Heart, AlertCircle } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
            <p className="text-stone-600 font-medium">Loading causes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-red-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-semibold">Error Loading Causes</h3>
            </div>
            <p className="text-stone-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-800">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Manage Causes
            </h1>
          </div>
        </div>

        {/* Create New Cause Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-5 py-2">
          <h2 className="text-xl font-semibold text-stone-800 mb-4 mt-2 flex items-center gap-2">
            <Plus className="h-5 w-5 text-teal-600" />
            Add New Cause
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Cause Name</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-stone-50 focus:bg-white"
                placeholder="Enter cause name"
                value={newCause.name}
                onChange={(e) => setNewCause({ ...newCause, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-stone-50 focus:bg-white"
                placeholder="Brief description"
                value={newCause.description}
                onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Icon</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 bg-stone-50 focus:bg-white"
                placeholder="Icon name"
                value={newCause.icon}
                onChange={(e) => setNewCause({ ...newCause, icon: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">&nbsp;</label>
              <button
                onClick={createCause}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Plus className="h-4 w-4" />
                Create Cause
              </button>
            </div>
          </div>
        </div>

        {/* Causes Table */}
        <div className="bg-white rounded-2xl shadow-lg  overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-slate-500 to-cyan-800">
            <h2 className="text-xl font-semibold text-white">
              Existing Causes ({causes.length})
            </h2>
          </div>
          
          {causes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-600 mb-2">No causes yet</h3>
              <p className="text-stone-500">Create your first cause to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-stone-50 to-stone-100 border-b border-stone-200">
                    <th className="text-left p-6 font-semibold text-stone-700">Cause Name</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Description</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Icon</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {causes.map((cause, index) => (
                    <tr 
                      key={cause._id} 
                      className={`border-b border-stone-100 hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-teal-50/30 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
                      }`}
                    >
                      <td className="p-6">
                        <div className="font-medium text-stone-800">{cause.name}</div>
                      </td>
                      <td className="p-6">
                        <div className="text-stone-600 max-w-xs truncate" title={cause.description}>
                          {cause.description}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 rounded-full text-sm font-medium">
                          {cause.icon}
                        </div>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => deleteCause(cause._id)}
                          className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="Delete cause"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Causes;