// src/pages/admin/users.jsx
import React, { useEffect, useState } from 'react';
import { Eye, Trash2, CheckCircle, Loader2, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/users`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (id, isVerified) => {
    try {
      await fetch(`${baseURL}/admin/users/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ isVerified })
      });
      fetchUsers();
    } catch (err) {
      alert('Verification failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user permanently?')) return;
    try {
      await fetch(`${baseURL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      fetchUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">All Users</h1>
      <table className="w-full text-sm bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-gray-200">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.isVerified ? 'Yes' : 'No'}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => verifyUser(u._id, !u.isVerified)} className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200">
                  {u.isVerified ? <X className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                </button>
                <button onClick={() => deleteUser(u._id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200">
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

export default Users;
