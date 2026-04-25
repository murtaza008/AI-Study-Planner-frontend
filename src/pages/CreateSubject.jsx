import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubject } from '../services/api';
import { Card, Input, Button } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export const CreateSubject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: '',
    examDate: '',
    topics: [{ topicName: '', difficulty: 'medium' }]
  });

  const handleAddTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, { topicName: '', difficulty: 'medium' }]
    });
  };

  const handleRemoveTopic = (index) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...formData.topics];
    newTopics[index][field] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await createSubject(formData);
      navigate(`/subjects/${data.subject._id}`);
    } catch (err) {
      console.error('Failed to create subject', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          Step {step} of 2
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Create Study Plan</h1>
        <p className="text-slate-400">Let's set up your subject and topics to generate a plan.</p>
      </div>

      <Card className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="p-3 bg-primary rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Subject Details</h3>
                  <p className="text-sm text-slate-400">Basic info about what you're studying.</p>
                </div>
              </div>

              <Input
                label="Subject Name"
                placeholder="e.g. Advanced Mathematics"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              />
              
              <Input
                label="Exam Date"
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              />

              <Button 
                className="w-full py-4 text-lg flex items-center justify-center gap-2 mt-8"
                onClick={() => setStep(2)}
                disabled={!formData.subjectName || !formData.examDate}
              >
                Next Step: Add Topics
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="p-3 bg-secondary rounded-xl">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Course Topics</h3>
                  <p className="text-sm text-slate-400">List the topics you need to cover.</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="flex items-end gap-3 group">
                    <div className="flex-1">
                      <Input
                        placeholder={`Topic ${index + 1}`}
                        value={topic.topicName}
                        onChange={(e) => handleTopicChange(index, 'topicName', e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <select
                        className="input-field py-3 h-[48px]"
                        value={topic.difficulty}
                        onChange={(e) => handleTopicChange(index, 'difficulty', e.target.value)}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    {formData.topics.length > 1 && (
                      <button
                        onClick={() => handleRemoveTopic(index)}
                        className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all h-[48px]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2 border-dashed border-2 hover:border-primary hover:text-primary transition-all"
                onClick={handleAddTopic}
              >
                <Plus className="w-4 h-4" />
                Add Another Topic
              </Button>

              <div className="flex gap-4 pt-8">
                <Button 
                  variant="secondary" 
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button 
                  className="flex-[2] flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                  disabled={loading || formData.topics.some(t => !t.topicName)}
                >
                  {loading ? 'Creating...' : 'Generate Plan'}
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
