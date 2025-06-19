import React, { useState, useEffect } from 'react';
import { User, Calendar, DollarSign, MapPin, Camera, Tag, AlertCircle, CheckCircle, Lock, X } from 'lucide-react';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cause: '',
    goalAmount: '',
    endDate: '',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryAge: '',
    beneficiaryDetails: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    isUrgent: false,
    tags: '',
  });

  const [images, setImages] = useState([]);
  const [imageCaptions, setImageCaptions] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [loadingCauses, setLoadingCauses] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const relationshipOptions = ['self', 'family', 'friend', 'organization', 'community', 'relative'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setTimeout(() => {
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCauses();
    }
  }, [isAuthenticated]);

  const fetchCauses = async () => {
    try {
      setLoadingCauses(true);
      const res = await fetch('http://localhost:5000/api/causes/get-causes');
      const data = await res.json();
      setCauses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch causes.');
      setCauses([]);
    } finally {
      setLoadingCauses(false);
    }
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 16);
    setFormData((prev) => ({ ...prev, endDate: iso }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = images.length + newFiles.length;
    if (total > 5) {
      setError('You can only upload a maximum of 5 images');
      return;
    }
    setImages(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageCaptions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      const reindexed = {};
      Object.keys(copy).forEach((k) => {
        const i = parseInt(k);
        if (i > index) {
          reindexed[i - 1] = copy[k];
        } else {
          reindexed[i] = copy[k];
        }
      });
      return reindexed;
    });
  };

  const handleCaptionChange = (index, value) => {
    setImageCaptions((prev) => ({ ...prev, [index]: value }));
  };

  const handleCauseSelect = (id) => {
    setFormData((prev) => ({ ...prev, cause: id }));
    setDropdownOpen(false);
  };

  const getSelectedCauseName = () => {
    const selected = causes.find((c) => c._id === formData.cause);
    return selected ? selected.name : 'Select a cause';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (val) form.append(key, val);
      });

      images.forEach((img, i) => {
        form.append('images', img);
        if (imageCaptions[i]) {
          form.append(`imageCaption_${i}`, imageCaptions[i]);
        }
      });

      const res = await fetch('http://localhost:5000/api/campaign/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Campaign creation failed');
      }

      const result = await res.json();
      console.log('Campaign created:', result);
      setMessage('Campaign created successfully!');
      setFormData({
        title: '',
        description: '',
        cause: '',
        goalAmount: '',
        endDate: '',
        beneficiaryName: '',
        beneficiaryRelationship: '',
        beneficiaryAge: '',
        beneficiaryDetails: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        isUrgent: false,
        tags: '',
      });
      setImages([]);
      setImageCaptions({});
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <Lock className="w-10 h-10 text-cyan-500" />
        <p className="text-lg">Please login to create a campaign.</p>
        <button
          onClick={handleLogin}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>

      {message && (
        <div className="p-3 bg-green-100 text-green-700 rounded flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Campaign Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Campaign Description"
          className="w-full border p-2 rounded"
          required
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border p-2 rounded flex justify-between items-center"
          >
            {getSelectedCauseName()}
            <span>▾</span>
          </button>
          {dropdownOpen && (
            <ul className="absolute bg-white border w-full mt-1 z-10 max-h-60 overflow-auto rounded shadow">
              {causes.map((cause) => (
                <li
                  key={cause._id}
                  className="p-2 hover:bg-cyan-100 cursor-pointer"
                  onClick={() => handleCauseSelect(cause._id)}
                >
                  {cause.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          name="goalAmount"
          type="number"
          value={formData.goalAmount}
          onChange={handleChange}
          placeholder="Goal Amount"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="endDate"
          type="datetime-local"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />

        {/* Beneficiary Section */}
        <input
          name="beneficiaryName"
          type="text"
          value={formData.beneficiaryName}
          onChange={handleChange}
          placeholder="Beneficiary Name"
          className="w-full border p-2 rounded"
          required
        />
        <select
  name="beneficiaryRelationship"
  value={formData.beneficiaryRelationship}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  required
>
  <option value="" disabled>Select relationship</option>
  {relationshipOptions.map((option) => (
    <option key={option} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ))}
</select>

        <input
          name="beneficiaryAge"
          type="number"
          value={formData.beneficiaryAge}
          onChange={handleChange}
          placeholder="Beneficiary Age"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="beneficiaryDetails"
          value={formData.beneficiaryDetails}
          onChange={handleChange}
          placeholder="Additional details"
          className="w-full border p-2 rounded"
        />

        {/* Location */}
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="flex gap-2 items-center">
          <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} />
          Mark as urgent
        </label>

        {/* Images Upload */}
        {images.length < 5 && (
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        )}
        {images.map((img, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded mt-2">
            <div className="flex justify-between items-center">
              <span>{img.name}</span>
              <button onClick={() => removeImage(i)} type="button" className="text-red-500">
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              value={imageCaptions[i] || ''}
              onChange={(e) => handleCaptionChange(i, e.target.value)}
              placeholder="Image caption"
              className="w-full border mt-1 p-1 rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
        >
          {isLoading ? 'Submitting...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
