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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/causes/get-causes`);
;
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

      const res = await fetch('${process.env.REACT_APP_API_URL}/campaign/create', {
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-stone-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-stone-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-stone-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-cyan-600" />
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Authentication Required</h2>
          <p className="text-stone-600 mb-6">Please login to create a campaign.</p>
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-stone-50 to-teal-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
            <h1 className="text-3xl font-bold text-white">Create Campaign</h1>
            <p className="text-cyan-100 mt-2">Share your cause and make a difference</p>
          </div>

          <div className="p-6">
            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-3 mb-6">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Campaign Details Section */}
              <div className="bg-stone-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-teal-600" />
                  Campaign Details
                </h3>
                <div className="space-y-4">
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Campaign Title"
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200"
                    required
                  />
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell your story and explain why this campaign matters..."
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200 resize-none"
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full border border-stone-300 focus:border-cyan-500 p-3 rounded-lg flex justify-between items-center bg-white hover:bg-stone-50 transition-colors duration-200"
                    >
                      <span className={formData.cause ? 'text-stone-800' : 'text-stone-500'}>
                        {getSelectedCauseName()}
                      </span>
                      <span className={`transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    {dropdownOpen && (
                      <ul className="absolute bg-white border border-stone-300 w-full mt-1 z-10 max-h-60 overflow-auto rounded-lg shadow-lg">
                        {causes.map((cause) => (
                          <li
                            key={cause._id}
                            className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-stone-100 last:border-b-0 transition-colors duration-150"
                            onClick={() => handleCauseSelect(cause._id)}
                          >
                            {cause.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                      <input
                        name="goalAmount"
                        type="number"
                        value={formData.goalAmount}
                        onChange={handleChange}
                        placeholder="Goal Amount"
                        className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 pl-10 pr-3 py-3 rounded-lg transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                      <input
                        name="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 pl-10 pr-3 py-3 rounded-lg transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  <input
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200"
                  />
                </div>
              </div>

              {/* Beneficiary Section */}
              <div className="bg-teal-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Beneficiary Information
                </h3>
                <div className="space-y-4">
                  <input
                    name="beneficiaryName"
                    type="text"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    placeholder="Beneficiary Name"
                    className="w-full border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 p-3 rounded-lg transition-all duration-200"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="beneficiaryRelationship"
                      value={formData.beneficiaryRelationship}
                      onChange={handleChange}
                      className="w-full border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 p-3 rounded-lg transition-all duration-200"
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
                      className="w-full border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 p-3 rounded-lg transition-all duration-200"
                    />
                  </div>
                  <textarea
                    name="beneficiaryDetails"
                    value={formData.beneficiaryDetails}
                    onChange={handleChange}
                    placeholder="Additional details about the beneficiary..."
                    className="w-full border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 p-3 rounded-lg transition-all duration-200 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-cyan-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="country" 
                    placeholder="Country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200" 
                    required 
                  />
                  <input 
                    name="state" 
                    placeholder="State" 
                    value={formData.state} 
                    onChange={handleChange} 
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200" 
                    required 
                  />
                  <input 
                    name="city" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200" 
                    required 
                  />
                  <input 
                    name="pincode" 
                    placeholder="Pincode" 
                    value={formData.pincode} 
                    onChange={handleChange} 
                    className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg transition-all duration-200" 
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-stone-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-teal-600" />
                  Campaign Images
                  <span className="text-sm text-stone-500 font-normal ml-2">
                    ({images.length}/5)
                  </span>
                </h3>
                
                {images.length < 5 && (
                  <div className="mb-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageChange}
                      className="w-full border border-stone-300 focus:border-cyan-500 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-all duration-200"
                    />
                  </div>
                )}
                
                {images.map((img, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-stone-700 font-medium truncate">{img.name}</span>
                      <button 
                        onClick={() => removeImage(i)} 
                        type="button" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={imageCaptions[i] || ''}
                      onChange={(e) => handleCaptionChange(i, e.target.value)}
                      placeholder="Add a caption for this image..."
                      className="w-full border border-stone-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-2 rounded-lg transition-all duration-200"
                    />
                  </div>
                ))}
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <input 
                  type="checkbox" 
                  name="isUrgent" 
                  checked={formData.isUrgent} 
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 bg-amber-100 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                />
                <label className="text-stone-700 font-medium">
                  Mark as urgent campaign
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-stone-400 disabled:to-stone-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Create Campaign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;