import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService';
import { applicationService } from '../../services/applicationService';
import { BookOpen, FileText, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SponsorDashboard = () => {
  const [stats, setStats] = useState({
    totalScholarships: 0,
    totalApplications: 0,
    approvedStudents: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch scholarships
      const scholarshipsResponse = await scholarshipService.getSponsorScholarships();
      const scholarships = scholarshipsResponse.scholarships || [];

      // Fetch applications
      const applicationsResponse = await applicationService.getSponsorApplications();
      const applications = applicationsResponse.applications || [];

      setStats({
        totalScholarships: scholarships.length,
        totalApplications: applications.length,
        approvedStudents: applications.filter(app => app.status === 'approved').length,
      });

      setRecentApplications(applications.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Scholarships',
      value: stats.totalScholarships,
      icon: BookOpen,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      trend: '+12%',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      trend: '+24%',
    },
    {
      title: 'Approved Students',
      value: stats.approvedStudents,
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      trend: '+8%',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Sponsor Dashboard</h1>
        <p className="text-white/90">Manage your scholarships and review applications</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/sponsor/create"
          className="bg-card border rounded-xl p-6 hover:shadow-lg transition-smooth group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Create New Scholarship</h3>
              <p className="text-sm text-muted-foreground">Post a new scholarship opportunity</p>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg group-hover:bg-accent/20 transition-smooth">
              <Plus className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Link>

        <Link
          to="/sponsor/applications"
          className="bg-card border rounded-xl p-6 hover:shadow-lg transition-smooth group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Review Applications</h3>
              <p className="text-sm text-muted-foreground">Manage student applications</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg group-hover:bg-primary/20 transition-smooth">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-card rounded-xl p-6 border shadow-md hover:shadow-lg transition-smooth">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-4 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center text-success text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Applications</h2>
          <Link
            to="/sponsor/applications"
            className="text-primary hover:text-primary-dark flex items-center group transition-smooth"
          >
            View All
            <span className="ml-2 group-hover:translate-x-1 transition-smooth">→</span>
          </Link>
        </div>

        {recentApplications.length > 0 ? (
          <div className="bg-card rounded-xl border shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Scholarship</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-smooth">
                    <td className="px-6 py-4">
                      <div className="font-medium">{app.student?.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{app.student?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{app.scholarship?.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'approved'
                            ? 'bg-success/10 text-success'
                            : app.status === 'rejected'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card rounded-xl border p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">Applications will appear here once students apply</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorDashboard;
