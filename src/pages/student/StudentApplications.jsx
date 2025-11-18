import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { FileText, CheckCircle, Clock, XCircle, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.applications || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your scholarship applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-card p-2 rounded-lg border inline-flex">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2">
              ({applications.filter((app) => status === 'all' || app.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-smooth"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{application.scholarship?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(application.status)}
                  {application.scholarship?.amount && (
                    <div className="flex items-center text-accent font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {application.scholarship.amount}
                    </div>
                  )}
                </div>
              </div>

              {application.scholarship?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {application.scholarship.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Deadline: {new Date(application.scholarship?.deadline).toLocaleDateString()}
                </div>
                <Link
                  to={`/student/scholarships/${application.scholarship?.id}`}
                  className="text-primary hover:text-primary-dark text-sm font-medium transition-smooth"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all'
                ? 'You haven\'t applied to any scholarships yet'
                : `No ${filter} applications`}
            </p>
            <Link
              to="/student/scholarships"
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-smooth"
            >
              Browse Scholarships
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
