import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/ui/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages (I'll create these next)
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { CreateSubject } from './pages/CreateSubject';
import { SubjectDetails } from './pages/SubjectDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen">
          <Navbar />
          <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subjects/new" 
                element={
                  <ProtectedRoute>
                    <CreateSubject />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subjects/:id" 
                element={
                  <ProtectedRoute>
                    <SubjectDetails />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
