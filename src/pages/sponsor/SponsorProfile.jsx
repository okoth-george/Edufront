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
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);
 
  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      // Backend might return the profile in different shapes:
      // - a user/profile object directly
      // - { user: { ... } }
      // - { profile: { ... } }
      const resolved = response?.user ?? response?.profile ?? response ?? null;
      if (resolved) {
        setProfile(resolved);
        setIsNewProfile(false); // We will UPDATE later
      } else {
        // No profile returned -> treat as new profile
        setIsNewProfile(true);
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        setIsNewProfile(true); // Enable POST mode
        setProfile({ name: '', email: '', contact_number: '', organization_name: '', website: '', description: '' });
      } else {
        const msg = error?.message || error?.response?.data || 'Failed to load profile';
        toast.error(msg);
      }
      
    } finally {
      setLoading(false);
    }
  };

  

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNewProfile) {
        // SCENARIO 1: Create new (POST)
        await authService.createProfile(profile);
        toast.success('Profile created successfully!');
        setIsNewProfile(false); // Next time, it will be an update
      } else {
        // SCENARIO 2: Update existing (PUT/PATCH)
        await authService.updateProfile(profile);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save profile');
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
                  className="w-full pl-12 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
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
            {saving ? 'Saving...' : (isNewProfile ? 'Create Profile' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorProfile;
