import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { scholarshipService } from '../../services/scholarshipService';
import { FileText, CheckCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
  });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const applicationsResponse = await applicationService.getMyApplications();
      const applications = applicationsResponse.applications || [];
      
      setStats({
        totalApplications: applications.length,
        approved: applications.filter(app => app.status === 'approved').length,
        pending: applications.filter(app => app.status === 'pending').length,
      });

      // Fetch recommended scholarships
      const scholarshipsResponse = await scholarshipService.getAllScholarships({ limit: 6 });
      setScholarships(scholarshipsResponse.scholarships || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      bgColor: 'bg-warning/10',
      iconColor: 'text-warning',
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
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-white/90">Find scholarships that match your goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-card rounded-xl p-6 border shadow-md hover:shadow-lg transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recommended Scholarships</h2>
          <Link
            to="/student/scholarships"
            className="text-primary hover:text-primary-dark flex items-center group transition-smooth"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.length > 0 ? (
            scholarships.map((scholarship) => (
              <Link
                key={scholarship.id}
                to={`/student/scholarships/${scholarship.id}`}
                className="bg-card rounded-xl p-6 border hover:shadow-lg transition-smooth group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-primary/10 p-3 rounded-lg`}>
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-accent">${scholarship.amount}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
                  {scholarship.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {scholarship.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                  <span className="text-primary group-hover:translate-x-1 transition-smooth">→</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scholarships available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
