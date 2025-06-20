import React, { useEffect, useState } from 'react';
import { Loader2, Camera, Save } from 'lucide-react';

const UserProfile = () => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STATIC_BASE = API_BASE.replace('/api', ''); // Removes "/api"

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [message, setMessage] = useState('');

  const getAuthToken = () => localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/user/own-profile`, {
        headers: { 'x-auth-token': getAuthToken() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data);
      setForm({
        name: data.name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        location: {
  country: data.location?.country ?? '',
  state: data.location?.state ?? '',
  city: data.location?.city ?? '',
  pincode: data.location?.pincode ?? ''
},

        socialLinks: {
          twitter: data.socialLinks?.twitter || '',
          linkedin: data.socialLinks?.linkedin || '',
        },
        preferences: {
          publicProfile: data.preferences?.publicProfile || false,
        }
      });
    } catch (err) {
      setMessage(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInput = (e) => {
  const { name, value } = e.target;

  if (name.startsWith('socialLinks.')) {
    const key = name.split('.')[1];
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  } else if (name.startsWith('preferences.')) {
    const key = name.split('.')[1];
    setForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: e.target.checked }
    }));
  } else if (name.startsWith('location.')) {
    const key = name.split('.')[1];
    setForm(prev => ({
      ...prev,
      location: { ...prev.location, [key]: value }
    }));
  } else {
    setForm(prev => ({ ...prev, [name]: value }));
  }
};


  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/user/upload-avatar`, {
        method: 'POST',
        headers: { 'x-auth-token': getAuthToken() },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser((prev) => ({ ...prev, profilePicture: data.profilePicture }));
      setMessage('Profile picture updated');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': getAuthToken()
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h1>

      {message && (
        <div className="mb-4 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded border border-blue-100">
          {message}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border">
          <img
             key={user?.profilePicture}
            src={
              user?.profilePicture
                ? `${STATIC_BASE}${user.profilePicture}`
                : '/default-avatar.png'
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline">
            <Camera className="h-4 w-4" />
            Change Avatar
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </label>
          {avatarUploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleInput} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleInput} rows="3" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleInput} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
  <label className="block text-sm mb-1">Country</label>
  <input name="location.country" value={form.location?.country} onChange={handleInput} className="w-full border rounded px-3 py-2" />
</div>
<div>
  <label className="block text-sm mb-1">State</label>
  <input name="location.state" value={form.location?.state} onChange={handleInput} className="w-full border rounded px-3 py-2" />
</div>
<div>
  <label className="block text-sm mb-1">City</label>
  <input name="location.city" value={form.location?.city} onChange={handleInput} className="w-full border rounded px-3 py-2" />
</div>
<div>
  <label className="block text-sm mb-1">Pincode</label>
  <input name="location.pincode" value={form.location?.pincode} onChange={handleInput} className="w-full border rounded px-3 py-2" />
</div>

        <div>
          <label className="block text-sm mb-1">Twitter</label>
          <input name="socialLinks.twitter" value={form.socialLinks?.twitter || ''} onChange={handleInput} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">LinkedIn</label>
          <input name="socialLinks.linkedin" value={form.socialLinks?.linkedin || ''} onChange={handleInput} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="preferences.publicProfile"
            checked={form.preferences?.publicProfile || false}
            onChange={handleInput}
          />
          <label className="text-sm">Make my profile public</label>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;