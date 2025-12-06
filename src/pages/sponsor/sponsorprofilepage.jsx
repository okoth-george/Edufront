import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Import your existing Create Form component if you have one
//import CreateSponsorForm from './CreateSponsorForm'; 

const Sponsorprofile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // To toggle Edit mode

  // 1. Fetch Profile on Load
  useEffect(() => {
    fetchProfile();
  }, []);

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
  };

  if (loading) return <div>Loading...</div>;

  // SCENARIO A: User has no profile -> Show Create Form
  if (!profile) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="mb-4 text-gray-600">You need to create a sponsor profile before you can post scholarships.</p>
        {/* Render your Create Form here, pass a callback to refresh data after success */}
        <CreateSponsorForm onSuccess={fetchProfile} />
      </div>
    );
  }

  // SCENARIO B: User has a profile -> Show Details
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sponsor Profile</h1>
        <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        /* Render Edit Form (Or reuse Create Form with initialData) */
        <CreateSponsorForm initialData={profile} onSuccess={() => {
            setIsEditing(false);
            fetchProfile();
        }} />
      ) : (
        /* View Mode */
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Organization Name</span>
            <span className="text-lg font-semibold">{profile.organization_name}</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Contact Number</span>
            <span className="text-lg font-semibold">{profile.contact_number || "Not provided"}</span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Account ID</span>
            <span className="text-sm text-gray-400">#{profile.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsorprofile;