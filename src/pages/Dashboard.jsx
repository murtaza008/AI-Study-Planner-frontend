import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubjects } from '../services/api';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Calendar, ChevronRight, Clock, Award } from 'lucide-react';

export const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await getSubjects();
      setSubjects(data.subjects);
    } catch (err) {
      console.error('Failed to fetch subjects', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">My Learning Dashboard</h1>
          <p className="text-slate-400">Track your progress and stay on top of your studies.</p>
        </div>
        <Link to="/subjects/new">
          <Button className="flex items-center gap-2 px-6">
            <Plus className="w-5 h-5" />
            Add New Subject
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Subjects', value: subjects.length, icon: <BookOpen className="w-5 h-5 text-primary" /> },
          { label: 'Days Until Next Exam', value: '12', icon: <Calendar className="w-5 h-5 text-secondary" /> },
          { label: 'Total Topics Completed', value: '45%', icon: <Award className="w-5 h-5 text-accent" /> },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 py-4 px-6">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Subjects List */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Your Subjects
          <span className="text-sm font-normal text-slate-500 bg-white/5 px-2.5 py-0.5 rounded-full">
            {subjects.length}
          </span>
        </h2>

        {subjects.length === 0 ? (
          <Card className="text-center py-20 flex flex-col items-center">
            <div className="p-6 bg-white/5 rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No subjects yet</h3>
            <p className="text-slate-400 mb-8 max-w-md">
              Add your first subject to start generating AI-powered study plans.
            </p>
            <Link to="/subjects/new">
              <Button>Get Started</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, i) => (
              <motion.div
                key={subject._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/subjects/${subject._id}`}>
                  <Card className="glass-hover h-full flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(subject.examDate).toLocaleDateString()}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {subject.subjectName}
                    </h3>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Topics</span>
                        <span className="font-semibold">{subject.topics.length}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${Math.min((subject.topics.filter(t => t.completed).length / subject.topics.length || 0) * 100, 100)}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-end text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                        View Plan <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
