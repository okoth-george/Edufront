import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { FileText, CheckCircle, XCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const SponsorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getSponsorApplications();
      setApplications(response.applications || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      toast.success(`Application ${status} successfully`);
      
      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
      setSelectedApp(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
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
        <h1 className="text-3xl font-bold mb-2">Applications</h1>
        <p className="text-muted-foreground">Review and manage student applications</p>
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

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-smooth"
            >
              {/* Student Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{application.student?.name || 'N/A'}</h3>
                    <p className="text-sm text-muted-foreground">{application.student?.email}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    application.status === 'approved'
                      ? 'bg-success/10 text-success border-success/20'
                      : application.status === 'rejected'
                      ? 'bg-destructive/10 text-destructive border-destructive/20'
                      : 'bg-warning/10 text-warning border-warning/20'
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>

              {/* Scholarship Info */}
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{application.scholarship?.title}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Student Details */}
              {application.student && (
                <div className="space-y-2 text-sm mb-4">
                  {application.student.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {application.student.phone}
                    </div>
                  )}
                  {application.student.gpa && (
                    <div className="text-muted-foreground">
                      <strong>GPA:</strong> {application.student.gpa}
                    </div>
                  )}
                  {application.student.schoolLevel && (
                    <div className="text-muted-foreground">
                      <strong>Level:</strong> {application.student.schoolLevel}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {application.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'approved')}
                    className="flex-1 bg-success/10 text-success px-4 py-2.5 rounded-lg hover:bg-success/20 transition-smooth flex items-center justify-center font-medium"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'rejected')}
                    className="flex-1 bg-destructive/10 text-destructive px-4 py-2.5 rounded-lg hover:bg-destructive/20 transition-smooth flex items-center justify-center font-medium"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-card rounded-xl border">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'No applications have been submitted yet'
                : `No ${filter} applications`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorApplications;
