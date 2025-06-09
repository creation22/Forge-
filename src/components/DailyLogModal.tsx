import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (logData: {
    relapsed: boolean;
    relapseCount: number;
    urgeLevel: number;
    mood: number;
    notes?: string;
  }) => void;
}

const DailyLogModal: React.FC<DailyLogModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [relapsed, setRelapsed] = useState(false);
  const [relapseCount, setRelapseCount] = useState(0);
  const [urgeLevel, setUrgeLevel] = useState(1);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤩', '🥳', '🌟', '✨'];
  const moodLabels = ['Terrible', 'Bad', 'Poor', 'Okay', 'Good', 'Great', 'Amazing', 'Fantastic', 'Incredible', 'Perfect'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubmit({
      relapsed,
      relapseCount: relapsed ? relapseCount : 0,
      urgeLevel,
      mood,
      notes: notes.trim() || undefined
    });

    setSubmitted(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setRelapsed(false);
      setRelapseCount(0);
      setUrgeLevel(1);
      setMood(5);
      setNotes('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Check-in</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Relapse Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Did you relapse today?
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setRelapsed(false)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          !relapsed
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setRelapsed(true)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          relapsed
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  {/* Relapse Count */}
                  {relapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        How many times?
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={relapseCount}
                        onChange={(e) => setRelapseCount(parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </motion.div>
                  )}

                  {/* Urge Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Urge Level (1-10): {urgeLevel}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={urgeLevel}
                      onChange={(e) => setUrgeLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Mood: {moodEmojis[mood - 1]} {moodLabels[mood - 1]}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={mood}
                      onChange={(e) => setMood(parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How was your day? Any triggers or victories?"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Log'}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Logged Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your daily check-in has been saved.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyLogModal;