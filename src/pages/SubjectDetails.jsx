import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubject, getPlan, generatePlan, togglePlanItem } from '../services/api';
import { Card, Button, cn } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  Layout, 
  BookOpen, 
  Trophy,
  AlertCircle
} from 'lucide-react';

export const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [subjectRes, planRes] = await Promise.all([
        getSubject(id),
        getPlan(id).catch(() => ({ data: { plan: null } }))
      ]);
      setSubject(subjectRes.data.subject);
      setPlan(planRes.data.plan);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generatePlan(id);
      await fetchData();
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (itemId) => {
    try {
      await togglePlanItem(plan._id, itemId);
      setPlan({
        ...plan,
        plan: plan.plan.map(item => 
          item._id === itemId ? { ...item, completed: !item.completed } : item
        )
      });
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completionPercentage = plan 
    ? Math.round((plan.plan.filter(i => i.completed).length / plan.plan.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{subject.subjectName}</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400">
              <span className="flex items-center gap-1.5 text-sm">
                <Calendar className="w-4 h-4" />
                Exam: {new Date(subject.examDate).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span className="flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4" />
                {subject.topics.length} Topics
              </span>
            </div>
          </div>
        </div>

        {!plan && (
          <Button 
            className="flex items-center gap-2 px-8 py-3"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'AI is Thinking...' : 'Generate Study Plan'}
            <Sparkles className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Study Plan */}
        <div className="lg:col-span-2 space-y-6">
          {plan ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Layout className="w-6 h-6 text-primary" />
                  Your Daily Schedule
                </h2>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Progress</p>
                    <p className="text-lg font-bold text-primary">{completionPercentage}%</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="32" cy="32" r="28"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-primary"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 * (1 - completionPercentage / 100)}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {plan.plan.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "p-0 overflow-hidden border-l-4 transition-all group",
                      item.completed ? "border-emerald-500 bg-emerald-500/5" : "border-primary bg-white/5"
                    )}>
                      <div className="p-5 flex items-center gap-6">
                        <button 
                          onClick={() => handleToggle(item._id)}
                          className={cn(
                            "flex-shrink-0 p-2 rounded-full transition-all",
                            item.completed ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500 hover:text-primary"
                          )}
                        >
                          {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Day {item.day}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                              <Clock className="w-3.5 h-3.5" />
                              {item.hours} hours
                            </div>
                          </div>
                          <h3 className={cn(
                            "text-lg font-bold truncate transition-all",
                            item.completed ? "text-slate-500 line-through" : "text-white"
                          )}>
                            {item.topic}
                          </h3>
                        </div>

                        <div className="hidden sm:block">
                          <Button 
                            variant="ghost" 
                            className={cn(
                              "text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                              item.completed ? "text-emerald-500" : "text-primary"
                            )}
                            onClick={() => handleToggle(item._id)}
                          >
                            {item.completed ? 'Completed' : 'Mark Done'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <Card className="text-center py-24 flex flex-col items-center">
              <div className="p-6 bg-white/5 rounded-full mb-8 relative">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to optimize your study?</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto">
                Our AI will analyze your topics and exam date to create the most efficient 
                learning path for you.
              </p>
              <Button 
                className="px-10 py-4 text-lg flex items-center gap-2"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Processing Data...' : 'Generate My AI Plan'}
                <Sparkles className="w-5 h-5" />
              </Button>
            </Card>
          )}
        </div>

        {/* Sidebar: Topics & Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Topics to Master
            </h3>
            <div className="space-y-4">
              {subject.topics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                  <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{topic.topicName}</span>
                  <span className={cn("badge", `badge-${topic.difficulty}`)}>
                    {topic.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-amber-500/20 bg-amber-500/5">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-500">
              <AlertCircle className="w-5 h-5" />
              Exam Strategy
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Focus on the <strong>Hard</strong> topics early in your schedule. 
              Review <strong>Easy</strong> topics during the final 48 hours for maximum retention.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

