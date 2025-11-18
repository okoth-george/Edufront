import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, TrendingUp, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EduBridge
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-primary transition-smooth font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-primary text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-smooth font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Connecting Students with
              <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                Scholarship Opportunities
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              EduBridge makes it easy for students to find and apply for scholarships,
              while empowering sponsors to support the next generation of leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-accent text-white px-8 py-4 rounded-lg hover:opacity-90 transition-smooth font-medium flex items-center justify-center group text-lg"
              >
                Join as Student
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Link>
              <Link
                to="/register"
                className="bg-card border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/5 transition-smooth font-medium flex items-center justify-center text-lg"
              >
                Join as Sponsor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduBridge?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're building a bridge between ambitious students and generous sponsors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Easy Discovery',
                description: 'Browse hundreds of scholarships with powerful search and filters',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: Users,
                title: 'Direct Connection',
                description: 'Connect directly with sponsors and track your application status',
                color: 'bg-accent/10 text-accent',
              },
              {
                icon: TrendingUp,
                title: 'Track Progress',
                description: 'Monitor your applications and celebrate your successes',
                color: 'bg-success/10 text-success',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border shadow-md hover:shadow-lg transition-smooth"
              >
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-primary rounded-2xl p-12 text-center text-white shadow-xl">
            <GraduationCap className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students finding their path to education, or become a sponsor
              and make a difference in someone's life.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-lg hover:bg-white/90 transition-smooth font-medium text-lg group"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">EduBridge</span>
            </div>
            <p className="text-muted-foreground">
              Connecting students with opportunities. Building futures together.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              © 2024 EduBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
