import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './index';
import { Sparkles, LogOut, LayoutDashboard, BookOpen, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-black/20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            StudyGenius
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/subjects" className="hover:text-white transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Subjects
                </Link>
              </div>
              <div className="h-6 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth?mode=login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
