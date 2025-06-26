// src/pages/admin/users.jsx
import React, { useEffect, useState } from 'react';
import { Eye, Trash2, CheckCircle, Loader2, X, FileText, Calendar, User, Mail, Phone, MapPin, AlertCircle, Clock, XCircle } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentAction, setDocumentAction] = useState({ userId: null, docIndex: null, action: null });

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}';

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

  const verifyUser = async (userId) => {
    try {
      const res = await fetch(`${baseURL}/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ isVerified: true })
      });
      if (!res.ok) throw new Error('Verification failed');
      fetchUsers();
      setShowDocuments(false);
      alert('User verified successfully!');
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  const updateDocumentStatus = async (userId, docIndex, status) => {
    try {
      const res = await fetch(`${baseURL}/admin/users/${userId}/documents/${docIndex}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Document update failed');
      fetchUsers();
      
      // Update the selected user's documents in real-time
      const updatedUser = users.find(u => u._id === userId);
      if (updatedUser && updatedUser.verificationDocuments[docIndex]) {
        updatedUser.verificationDocuments[docIndex].status = status;
        setSelectedUser(updatedUser);
      }
    } catch (err) {
      alert('Document update failed: ' + err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user permanently? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${baseURL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
      alert('User deleted successfully');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const openDocumentReview = (user) => {
    setSelectedUser(user);
    setShowDocuments(true);
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'government_id': 'Government ID',
      'address_proof': 'Address Proof',
      'bank_statement': 'Bank Statement'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const canVerifyUser = (user) => {
    return user.verificationDocuments?.length > 0 && 
           user.verificationDocuments.every(doc => doc.status === 'approved') &&
           !user.isVerified;
  };

  const hasPendingDocuments = (user) => {
    return user.verificationDocuments?.some(doc => doc.status === 'pending');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
            <p className="text-stone-600 font-medium">Loading users...</p>
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
              <h3 className="font-semibold">Error Loading Users</h3>
            </div>
            <p className="text-stone-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-slate-500 to-cyan-900">
            <h2 className="text-xl font-semibold text-stone-100">
              All Users ({users.length})
            </h2>
          </div>
          
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-600 mb-2">No users found</h3>
              <p className="text-stone-500">Users will appear here once they register</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-stone-50 to-stone-100 border-b border-stone-200">
                    <th className="text-left p-6 font-semibold text-stone-700">User Details</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Contact</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Verification Status</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Documents</th>
                    <th className="text-left p-6 font-semibold text-stone-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-stone-100 hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-teal-50/30 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
                      }`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-stone-800">{user.name}</div>
                            <div className="text-sm text-stone-500">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                              <CheckCircle className="h-4 w-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                              <Clock className="h-4 w-4" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          {user.verificationDocuments?.length > 0 ? (
                            <>
                              <div className="text-sm font-medium text-stone-700">
                                {user.verificationDocuments.length} document(s)
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {user.verificationDocuments.map((doc, idx) => (
                                  <div key={idx} className="text-xs">
                                    {getStatusBadge(doc.status)}
                                  </div>
                                ))}
                              </div>
                              {hasPendingDocuments(user) && (
                                <div className="text-xs text-amber-600 font-medium">
                                  Needs Review
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-stone-500">No documents</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          {user.verificationDocuments?.length > 0 && (
                            <button
                              onClick={() => openDocumentReview(user)}
                              className="p-3 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              title="Review documents"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          
                          {canVerifyUser(user) && (
                            <button
                              onClick={() => verifyUser(user._id)}
                              className="p-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              title="Verify user"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Document Review Modal */}
      {showDocuments && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800">{selectedUser.name}</h2>
                    <p className="text-stone-600">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDocuments(false)}
                  className="p-2 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <X className="h-6 w-6 text-stone-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedUser.verificationDocuments?.length > 0 ? (
                <>
                  <div className="grid gap-4">
                    {selectedUser.verificationDocuments.map((doc, index) => (
                      <div key={index} className="border border-stone-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-stone-600" />
                            <div>
                              <h3 className="font-semibold text-stone-800">
                                {getDocumentTypeLabel(doc.type)}
                              </h3>
                              <p className="text-sm text-stone-500">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>

                        {doc.url && (
                          <div className="bg-stone-50 rounded-lg p-4">
                            <img 
                              src={doc.url} 
                              alt={`${doc.type} document`}
                              className="max-w-full h-auto rounded-lg shadow-sm"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}

                        {doc.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateDocumentStatus(selectedUser._id, index, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => updateDocumentStatus(selectedUser._id, index, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {canVerifyUser(selectedUser) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Ready for Verification</h3>
                      </div>
                      <p className="text-green-700 mb-4">
                        All documents have been approved. You can now verify this user's account.
                      </p>
                      <button
                        onClick={() => verifyUser(selectedUser._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Verify User Account
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-600 mb-2">No Documents Uploaded</h3>
                  <p className="text-stone-500">This user hasn't uploaded any verification documents yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;