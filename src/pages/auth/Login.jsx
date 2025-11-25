import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate(user.role === 'student' ? '/student/dashboard' : '/sponsor/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      // Debug/log the response shape to help trace issues where backend logs success
      // but frontend sees an error
      // eslint-disable-next-line no-console
      console.debug('login response', response);

      toast.success('Login successful!');

      // Determine the current user from response, context or localStorage
      const currentUser = response?.user || user || (() => {
        try {
          return JSON.parse(localStorage.getItem('user'));
        } catch (err) {
          return null;
        }
      })();

      // Navigate based on role (defensive checks)
      if (currentUser && currentUser.role === 'student') {
        navigate('/student/dashboard');
      } else if (currentUser && currentUser.role) {
        navigate('/sponsor/dashboard');
      } else {
        // If role is missing, navigate to a safe default or profile
        navigate('/');
      }
    } catch (error) {
      // authService now throws Error instances with a message, but be defensive
      const message = error?.message || error?.detail || JSON.stringify(error) || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your EduBridge account</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-xl shadow-xl p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" /></label>
              <div className="relative">
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              
                <label className="block text-sm font-medium mb-2">Password   </label>
                         
              <div className="relative">

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="••••••••"             
  
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition-smooth">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-smooth disabled:opacity-50 flex items-center justify-center group"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-smooth">
                Sign up
              </Link>
              
            </p>
            <div className="text-xs text-muted-foreground mt-4">
              <Link to="/" 
              className="text-primary hover:text-primary-dark font-medium transition-smooth">
                Home page
              </Link>
              <br />
              <span>
              &copy; {new Date().getFullYear()} EduBridge. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
