import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import SponsorLayout from "./layouts/SponsorLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ScholarshipList from "./pages/student/ScholarshipList";
import ScholarshipDetails from "./pages/student/ScholarshipDetails";
import StudentApplications from "./pages/student/StudentApplications";
import StudentProfile from "./pages/student/StudentProfile";

// Sponsor Pages
import SponsorDashboard from "./pages/sponsor/SponsorDashboard";
import CreateScholarship from "./pages/sponsor/CreateScholarship";
import SponsorScholarships from "./pages/sponsor/SponsorScholarships";
import SponsorApplications from "./pages/sponsor/SponsorApplications";
import SponsorProfile from "./pages/sponsor/SponsorProfile";
import EditScholarship from './pages/sponsor/EditScholarship';
import Sponsorprofile from "./pages/sponsor/sponsorprofilepage";

// Other Pages
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster  />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="scholarships" element={<ScholarshipList />} />
              <Route path="scholarships/:id" element={<ScholarshipDetails />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* Sponsor Routes */}
            <Route
              path="/sponsor"
              element={
                <ProtectedRoute allowedRoles={['sponsor']}>
                  <SponsorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<SponsorDashboard />} />
              <Route path="create" element={<CreateScholarship />} />
              <Route path="scholarships" element={<SponsorScholarships />} />
              <Route path="applications" element={<SponsorApplications />} />
              <Route path="profile" element={<SponsorProfile />} />
             {/* <Route path="edit-scholarship/:id" element={<EditScholarship />} />*/}
              <Route path="/sponsor/scholarships/:id/edit" element={<EditScholarship />} />
              <Route path="sponsorprofile" element={<Sponsorprofile />} />
              

            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
