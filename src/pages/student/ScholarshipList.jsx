import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scholarshipService } from '../../services/scholarshipService';
import { Search, Filter, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await scholarshipService.getAllScholarships();
      setScholarships(response.scholarships || []);
    } catch (error) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await scholarshipService.searchScholarships(searchQuery);
      setScholarships(response.scholarships || []);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    if (filters.category && scholarship.category !== filters.category) return false;
    if (filters.minAmount && scholarship.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && scholarship.amount > parseFloat(filters.maxAmount)) return false;
    return true;
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
        <h1 className="text-3xl font-bold mb-2">Available Scholarships</h1>
        <p className="text-muted-foreground">Browse and apply for scholarships that match your profile</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-6 border shadow-md space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Search scholarships..."
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-smooth"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">All Categories</option>
              <option value="academic">Academic</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="need-based">Need-Based</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Amount ($)</label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Amount ($)</label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <Link
              key={scholarship.id}
              to={`/student/scholarships/${scholarship.id}`}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-smooth group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center text-accent font-bold text-lg">
                  <DollarSign className="h-5 w-5" />
                  {scholarship.amount}
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
                {scholarship.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {scholarship.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
                {scholarship.category && (
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {scholarship.category}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Scholarships Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipList;
