import React, { useEffect, useState } from 'react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState({});
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [authError, setAuthError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Get API base URL from environment or use default
  const API_BASE_URL = process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}';
  
  // Get token from localStorage with error handling
  const getAuthToken = () => {
    try {
      return localStorage.getItem('authToken') || localStorage.getItem('token');
    } catch (err) {
      console.error('Error accessing localStorage:', err);
      setAuthError(true);
      return null;
    }
  };
  
  // Get auth headers with validation
  const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchWithdrawals = async (status = statusFilter, page = currentPage) => {
    try {
      setLoading(true);
      setError('');
      setAuthError(false);
      
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/admin/withdrawals?status=${status}&page=${page}&limit=${pagination.limit}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWithdrawals(data.withdrawals || []);
      setPagination(data.pagination || {
        page: parseInt(page),
        limit: 10,
        total: 0,
        pages: 1
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      
      if (err.message === 'Authentication failed') {
        setAuthError(true);
        setError('Authentication failed. Please login again.');
      } else if (err.message === 'No authentication token available') {
        setAuthError(true);
        setError('No authentication token found. Please login.');
      } else {
        setError(err.message || 'Failed to fetch withdrawals');
      }
      setWithdrawals([]);
      setLoading(false);
    }
  };

  const handleAction = async (campaignId, withdrawalId, action) => {
    // Validate required parameters
    if (!campaignId || !withdrawalId) {
      alert('Invalid withdrawal request data');
      return;
    }

    const transactionId = prompt(`Enter Transaction ID to mark as ${action}:`);
    if (!transactionId || transactionId.trim() === '') {
      return;
    }

    const processingKey = `${campaignId}_${withdrawalId}`;
    setProcessing(prev => ({ ...prev, [processingKey]: true }));

    try {
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/admin/withdrawals/${campaignId}/${withdrawalId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: action,
          transactionId: transactionId.trim(),
          notes: `Processed by admin on ${new Date().toLocaleString()}`
        })
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setAuthError(true);
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the withdrawals list
      await fetchWithdrawals();
      
      alert(`Withdrawal request ${action} successfully!`);
    } catch (err) {
      console.error('Error processing withdrawal:', err);
      
      if (err.message === 'Authentication failed') {
        setAuthError(true);
        setError('Authentication failed. Please login again.');
      } else {
        alert(`Failed to ${action} withdrawal: ${err.message}`);
      }
    } finally {
      setProcessing(prev => ({ ...prev, [processingKey]: false }));
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    fetchWithdrawals(newStatus, 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchWithdrawals(statusFilter, newPage);
  };

  const handleLogin = () => {
    // This would typically redirect to login page or show login modal
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show authentication error screen
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h3>
            <p className="text-red-600 mb-6">You need to be logged in as an admin to access this page.</p>
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Login to Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && withdrawals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-teal-700 font-medium">Loading withdrawal requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="py-4 px-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-teal-800">Withdrawal Requests</h1>

            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              {['pending', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                    statusFilter === status
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && !authError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => fetchWithdrawals()}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {withdrawals.length === 0 && !loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-cyan-100">
            <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-2">No {statusFilter} withdrawals</h3>
            <p className="text-teal-600">There are currently no {statusFilter} withdrawal requests to display.</p>
          </div>
        ) : (
          <>
            {/* Withdrawals Grid */}
            <div className="grid gap-6 mb-6">
              {withdrawals.map((withdrawal) => {
                const processingKey = `${withdrawal.campaignId}_${withdrawal._id}`;
                const isProcessing = processing[processingKey];
                
                return (
                  <div key={withdrawal._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Main Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-teal-800 mb-1">
                              {withdrawal.campaignTitle}
                            </h2>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-teal-700">
                              {formatCurrency(withdrawal.amount)}
                            </div>
                            <div className="text-sm text-teal-600">
                              {formatDate(withdrawal.requestedAt)}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-teal-700">Requested By</label>
                              <p className="text-teal-800">{withdrawal.creator?.name}</p>
                              <p className="text-sm text-teal-600">{withdrawal.creator?.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-teal-700">Account Holder</label>
                              <p className="text-teal-800">{withdrawal.bankDetails?.accountHolderName}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-teal-700">Account Number</label>
                              <p className="text-teal-800 font-mono">{withdrawal.bankDetails?.accountNumber}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-teal-700">IFSC Code</label>
                              <p className="text-teal-800 font-mono">{withdrawal.bankDetails?.ifscCode}</p>
                            </div>
                          </div>
                        </div>

                        {/* Transaction ID (if completed) */}
                        {withdrawal.transactionId && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <label className="text-sm font-medium text-green-700">Transaction ID</label>
                            <p className="text-green-800 font-mono">{withdrawal.transactionId}</p>
                          </div>
                        )}

                        {/* Notes (if any) */}
                        {withdrawal.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <label className="text-sm font-medium text-blue-700">Notes</label>
                            <p className="text-blue-800">{withdrawal.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {withdrawal.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                          <button
                            onClick={() => handleAction(withdrawal.campaignId, withdrawal._id, 'completed')}
                            disabled={isProcessing}
                            className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200 min-w-[120px]"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleAction(withdrawal.campaignId, withdrawal._id, 'rejected')}
                            disabled={isProcessing}
                            className="flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200 min-w-[100px]"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-cyan-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-teal-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      className="px-4 py-2 bg-white text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            pageNum === pagination.page
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages || loading}
                      className="px-4 py-2 bg-white text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;