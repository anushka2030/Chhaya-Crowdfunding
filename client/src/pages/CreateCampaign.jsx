import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const token = localStorage.getItem('token');

  // Auto-set endDate to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    setFormData(prev => ({ ...prev, endDate: iso }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleCaptionChange = (index, value) => {
    setImageCaptions((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      images.forEach((file, index) => {
        form.append('images', file);
        if (imageCaptions[index]) {
          form.append(`imageCaption_${index}`, imageCaptions[index]);
        }
      });

      const res = await axios.post(
        'http://localhost:5000/api/campaign/create',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Campaign created successfully!');
      setFormData({});
      setImages([]);
      setImageCaptions({});
    } catch (err) {
      console.error(err);
      console.log("Full error:", err.response?.data);
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Campaign</h2>
      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic fields except endDate */}
        {[
          ['title', 'Title'],
          ['description', 'Description'],
          ['cause', 'Cause ID'],
          ['goalAmount', 'Goal Amount'],
          ['beneficiaryName', 'Beneficiary Name'],
          ['beneficiaryRelationship', 'Relationship (e.g., self, family)'],
          ['beneficiaryAge', 'Beneficiary Age'],
          ['beneficiaryDetails', 'Beneficiary Details'],
          ['country', 'Country'],
          ['state', 'State'],
          ['city', 'City'],
          ['pincode', 'Pincode'],
          ['tags', 'Tags (comma-separated)'],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block">{label}:</label>
            <input
              type={name === 'goalAmount' || name === 'beneficiaryAge' ? 'number' : 'text'}
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="border p-2 w-full"
              required={['title', 'description', 'cause', 'goalAmount', 'beneficiaryName', 'beneficiaryRelationship', 'country', 'state', 'city'].includes(name)}
            />
          </div>
        ))}

        {/* ✅ Custom endDate field */}
        <div>
          <label className="block">End Date (and Time):</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleChange}
              className="mr-2"
            />
            Mark as Urgent
          </label>
        </div>

        {/* File Upload */}
        <div>
          <label>Upload Images (max 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block mt-2"
          />
        </div>

        {/* Image Captions */}
        {images.map((img, idx) => (
          <div key={idx}>
            <label>Caption for {img.name}:</label>
            <input
              type="text"
              value={imageCaptions[idx] || ''}
              onChange={(e) => handleCaptionChange(idx, e.target.value)}
              className="border p-1 w-full"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
