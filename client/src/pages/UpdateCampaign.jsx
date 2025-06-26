import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';

const UpdateCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    endDate: '',
    isUrgent: false,
    tags: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [campaign, setCampaign] = useState(null);

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/campaign/${id}`, {
          headers: { 'x-auth-token': getAuthToken() }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setCampaign(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          goalAmount: data.goalAmount || '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          isUrgent: data.isUrgent || false,
          tags: (data.tags || []).join(', ')
        });
      } catch (err) {
        setError(err.message || 'Failed to load campaign');
      }
    };
    fetchCampaign();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    images.forEach((file, i) => {
      form.append('images', file);
      form.append(`imageCaption_${i}`, file.name); // optionally let users add custom captions
    });

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/campaign/update/${id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': getAuthToken() },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      navigate(`/my-campaign/${id}`);
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Campaign</h2>
<p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded mb-4">
  ⚠️ Note: Campaigns that are <strong>completed</strong> or <strong>active</strong> cannot be updated. Only drafts or pending review campaigns are editable.
</p>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {campaign ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Goal Amount (₹)</label>
              <input
                type="number"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleInputChange}
                className="mr-2"
              />
              Mark as urgent
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload New Images (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {loading ? 'Updating...' : 'Update Campaign'}
          </button>
        </form>
      ) : (
        <p>Loading campaign data...</p>
      )}
    </div>
  );
};

export default UpdateCampaign;
