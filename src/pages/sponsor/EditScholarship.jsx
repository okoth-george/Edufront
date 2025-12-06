import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService'; // Adjust path
import { toast } from 'sonner';
import { Save, ArrowLeft } from 'lucide-react';

const EditScholarship = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
    criteria: '',
    category: ''
  });

  // 1. Fetch Data on Component Mount
  useEffect(() => {
    const loadScholarship = async () => {
      try {
        const data = await scholarshipService.getScholarshipById(id);
        
        // Pre-fill form. ensure we format the date correctly for input type="date"
        setFormData({
          title: data.title,
          description: data.description,
          amount: data.amount,
          criteria: data.criteria,
          category: data.category || '',
          // Extract YYYY-MM-DD from the date string if needed
          deadline: data.deadline ? data.deadline.split('T')[0] : ''
        });
      } catch (error) {
        toast.error('Could not load scholarship details');
        navigate('/sponsor/scholarships'); // Go back on error
      } finally {
        setLoading(false);
      }
    };

    loadScholarship();
  }, [id, navigate]);

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await scholarshipService.updateScholarship(id, formData);
      toast.success('Scholarship updated successfully');
      navigate('/sponsor/scholarships'); // Redirect back to list
    } catch (error) {
      console.error(error);
      toast.error('Failed to update scholarship');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Edit Scholarship</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border">
        
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Criteria</label>
          <textarea
            name="criteria"
            rows="3"
            value={formData.criteria}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-background"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 flex justify-center items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="h-5 w-5" /> Update Scholarship</>}
        </button>
      </form>
    </div>
  );
};

export default EditScholarship;