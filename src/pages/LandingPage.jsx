import { motion } from 'framer-motion';
import { Button } from '../components/ui';
import { Link } from 'react-router-dom';
import { Brain, Target, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

export const LandingPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center max-w-4xl"
      >
        <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
          <Brain className="w-4 h-4" />
          <span>New: AI-Powered Study Planning v2.0</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-6xl md:text-7xl font-extrabold mb-8 leading-[1.1] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
          Master Your Exams with <br /> 
          <span className="text-primary">Intelligence.</span>
        </motion.h1>

        <motion.p variants={item} className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop guessing and start studying. StudyGenius creates personalized, 
          AI-driven study plans based on your exam dates and topic difficulty.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth?mode=register">
            <Button className="px-8 py-4 text-lg flex items-center gap-2 group">
              Start Planning Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth?mode=login">
            <Button variant="secondary" className="px-8 py-4 text-lg">
              View Demo
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-32 w-full">
        {[
          {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: "Smart Targeting",
            description: "AI analyzes your topics and prioritizes them based on exam urgency and difficulty level."
          },
          {
            icon: <Calendar className="w-8 h-8 text-secondary" />,
            title: "Dynamic Scheduling",
            description: "Automatically adjusts your daily study hours to ensure you cover everything before the big day."
          },
          {
            icon: <CheckCircle2 className="w-8 h-8 text-accent" />,
            title: "Progress Tracking",
            description: "Visual indicators and milestones keep you motivated and on track for success."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl card-gradient"
          >
            <div className="mb-6 p-3 bg-white/5 w-fit rounded-2xl border border-white/10">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
