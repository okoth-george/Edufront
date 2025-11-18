import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService';
import { applicationService } from '../../services/applicationService';
import { DollarSign, Calendar, User, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const response = await scholarshipService.getScholarshipById(id);
      setScholarship(response.scholarship);
    } catch (error) {
      toast.error('Failed to load scholarship details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.applyForScholarship(id, {
        message: 'I am interested in this scholarship',
      });
      toast.success('Application submitted successfully!');
      navigate('/student/applications');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Scholarship Not Found</h2>
        <button
          onClick={() => navigate('/student/scholarships')}
          className="text-primary hover:text-primary-dark"
        >
          ← Back to Scholarships
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/student/scholarships')}
        className="flex items-center text-muted-foreground hover:text-primary transition-smooth"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Scholarships
      </button>

      {/* Header Card */}
      <div className="bg-card rounded-xl p-8 border shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{scholarship.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>Sponsored by {scholarship.sponsor?.name || 'Anonymous'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent flex items-center">
              <DollarSign className="h-8 w-8" />
              {scholarship.amount}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Award Amount</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
          </div>
          {scholarship.category && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
              {scholarship.category}
            </span>
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full md:w-auto bg-gradient-accent text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-smooth disabled:opacity-50"
        >
          {applying ? 'Submitting...' : 'Apply Now'}
        </button>
      </div>

      {/* Description */}
      <div className="bg-card rounded-xl p-8 border shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Description
        </h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {scholarship.description}
        </p>
      </div>

      {/* Requirements */}
      {scholarship.requirements && (
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {scholarship.requirements}
          </p>
        </div>
      )}

      {/* Sponsor Info */}
      {scholarship.sponsor && (
        <div className="bg-card rounded-xl p-8 border shadow-md">
          <h2 className="text-xl font-semibold mb-4">About the Sponsor</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{scholarship.sponsor.name}</h3>
              {scholarship.sponsor.organization && (
                <p className="text-sm text-muted-foreground">{scholarship.sponsor.organization}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipDetails;
