import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'login';
  const [isLogin, setIsLogin] = useState(modeParam === 'login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(modeParam === 'login');
  }, [modeParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join StudyGenius'}
          </h2>
          <p className="text-slate-400">
            {isLogin ? 'Continue your learning journey' : 'Start your smart study plan today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Input
                  label="Username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required={!isLogin}
                  className="pl-10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="pl-10"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="pl-10"
          />

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" className="w-full py-4 text-lg mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
