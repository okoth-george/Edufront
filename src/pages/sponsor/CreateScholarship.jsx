import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService';
import { toast } from 'sonner';
import { DollarSign, Calendar, FileText, Tag, Save } from 'lucide-react';

const CreateScholarship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    deadline: '',
    category: '',
    criteria: '',
    requirements: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.deadline || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await scholarshipService.createScholarship(formData);
      toast.success('Scholarship created successfully!');
      navigate('/sponsor/scholarships');
    } catch (error) {
      toast.error(error.message || 'Failed to create scholarship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Scholarship</h1>
        <p className="text-muted-foreground">Fill in the details to create a new scholarship opportunity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Scholarship Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="e.g., STEM Excellence Scholarship 2024"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Award Amount ($) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="5000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Application Deadline <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    required
                  />
                </div>
              </div>
              
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="">Select a category</option>
                  <option value="academic">Academic Excellence</option>
                  <option value="sports">Sports & Athletics</option>
                  <option value="arts">Arts & Creativity</option>
                  <option value="need-based">Need-Based</option>
                  <option value="merit-based">Merit-Based</option>
                  <option value="stem">STEM</option>
                  <option value="community">Community Service</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Scholarship Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Provide a detailed description of the scholarship, its purpose, and what makes it unique..."
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Criteria for getting the scholarship <span className="text-destructive">*</span></label>
                <div className="relative">
                  
                  <textarea
                    
                    name="criteria"
                    value={formData.criteria}
                    rows={3}
                    onChange={handleChange}
                    className="w-full px-4  py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Specify the criteria that applicants must meet to be eligible for this scholarship..."
                    required
                  />
                </div>
              </div>

            <div>
              <label className="block text-sm font-medium mb-2">Requirements & Eligibility</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="List the requirements and eligibility criteria for this scholarship..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/sponsor/scholarships')}
            className="px-6 py-3 border border-input rounded-lg hover:bg-secondary transition-smooth"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-smooth disabled:opacity-50 flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Creating...' : 'Create Scholarship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScholarship;
