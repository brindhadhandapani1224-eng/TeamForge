import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Profile } from './pages/Profile.tsx';
import { EditProfile } from './pages/EditProfile.tsx';
import { ExploreProjects } from './pages/ExploreProjects.tsx';
import { ProjectDetails } from './pages/ProjectDetails.tsx';
import { CreateProject } from './pages/CreateProject.tsx';
import { MyProjects } from './pages/MyProjects.tsx';
import { TeamDashboard } from './pages/TeamDashboard.tsx';
import { Requests } from './pages/Requests.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { NotFound } from './pages/NotFound.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<ExploreProjects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/team-dashboard/:id" element={<TeamDashboard />} />
                <Route path="/requests" element={<Requests />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
