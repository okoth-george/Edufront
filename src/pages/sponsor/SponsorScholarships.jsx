import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService';
import { BookOpen, Edit, Trash2, Plus, DollarSign, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

const SponsorScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await scholarshipService.getSponsorScholarships();
      console.log("DATA FROM SERVICE:", response);
      //setScholarships(response.scholarships || []);
      setScholarships(response || []);
    } catch (error) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;

    try {
      await scholarshipService.deleteScholarship(id);
      toast.success('Scholarship deleted successfully');
      setScholarships(scholarships.filter(s => s.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to delete scholarship');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Scholarships</h1>
          <p className="text-muted-foreground">Manage all your scholarship listings</p>
        </div>
        <Link
          to="/sponsor/create"
          className="bg-gradient-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-smooth flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New
        </Link>
      </div>

      {scholarships.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{scholarship.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {scholarship.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-accent font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {scholarship.amount}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {scholarship.applicationsCount || 0} Applications
                        </div>
                      </div>

                      {scholarship.category && (
                        <div className="mt-3">
                          <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                            {scholarship.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/sponsor/scholarships/${scholarship.id}/edit`)}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-smooth"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(scholarship.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-smooth"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Created {new Date(scholarship.created_at).toLocaleDateString()}
                </span>
                <Link
                  to={`/sponsor/applications?scholarship=${scholarship.id}`}
                  className="text-primary hover:text-primary-dark text-sm font-medium transition-smooth"
                >
                  View Applications →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scholarships Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first scholarship to get started</p>
          <Link
            to="/sponsor/create"
            className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-smooth"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Scholarship
          </Link>
        </div>
      )}
    </div>
  );
};

export default SponsorScholarships;
