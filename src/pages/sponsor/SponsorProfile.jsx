import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import { User, Mail, Phone, Building, Save } from 'lucide-react';

const SponsorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact_number: '',
    organization_name: '',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);
 
  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfile(response.profile || {});
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
/*
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/v1/sponsors/sponsor/profile/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data); // User has a profile!
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // User has NO profile. keep profile as null.
        setProfile(null); 
      } else {
        toast.error("Error loading profile");
      }
    } finally {
      setLoading(false);
    }
  };*/

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sponsor Profile</h1>
        <p className="text-muted-foreground">Manage your organization information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="tel"
                  name="contact_number"
                  value={profile.contact_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Organization Information */}
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" />
            Organization Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                name="organization_name"
                value={profile.organization_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Your Organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">About Organization</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Tell us about your organization and its mission..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-smooth disabled:opacity-50 flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorProfile;
