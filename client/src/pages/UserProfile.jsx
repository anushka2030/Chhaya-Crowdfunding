import React, { useEffect, useState } from 'react';
import { Loader2, Camera, Save } from 'lucide-react';

const UserProfile = () => {
  const API_BASE = process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}';
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}'}/user/own-profile`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}'}/user/upload-avatar`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || '${process.env.REACT_APP_API_URL}'}/user/update-profile`, {
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
          <span className="text-lg font-medium text-gray-700">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 px-8 py-12 relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-teal-100 text-lg">Manage your personal information and preferences</p>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div className="mb-6 text-sm font-medium text-teal-700 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 rounded-xl border border-teal-200 shadow-sm">
                {message}
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-teal-200">
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
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-3 text-base font-semibold text-teal-700 hover:text-teal-800 bg-white px-4 py-2 rounded-xl border border-teal-300 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Camera className="h-5 w-5" />
                  Change Avatar
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
                {avatarUploading && <p className="text-sm text-teal-600 mt-2 font-medium">Uploading...</p>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-2xl border border-cyan-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleInput} 
                    rows="3" 
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 resize-none bg-white" 
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input 
                      name="location.country" 
                      value={form.location?.country} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input 
                      name="location.state" 
                      value={form.location?.state} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input 
                      name="location.city" 
                      value={form.location?.city} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input 
                      name="location.pincode" 
                      value={form.location?.pincode} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-2xl border border-cyan-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                    <input 
                      name="socialLinks.twitter" 
                      value={form.socialLinks?.twitter || ''} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                    <input 
                      name="socialLinks.linkedin" 
                      value={form.socialLinks?.linkedin || ''} 
                      onChange={handleInput} 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Privacy Preferences</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="preferences.publicProfile"
                    checked={form.preferences?.publicProfile || false}
                    onChange={handleInput}
                    className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <label className="text-base font-medium text-gray-700">Make my profile public</label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="flex items-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;