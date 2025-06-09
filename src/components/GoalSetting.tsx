import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { Goal } from '../types';

interface GoalSettingProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onDeleteGoal: (id: string) => void;
  onToggleGoal: (id: string) => void;
  currentStreak: number;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ 
  goals, 
  onAddGoal, 
  onDeleteGoal, 
  onToggleGoal,
  currentStreak 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDays: 7,
    type: 'short-term' as 'short-term' | 'long-term'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    onAddGoal({
      ...newGoal,
      isCompleted: false
    });

    setNewGoal({
      title: '',
      description: '',
      targetDays: 7,
      type: 'short-term'
    });
    setShowAddForm(false);
  };

  const getProgress = (goal: Goal) => {
    if (goal.isCompleted) return 100;
    return Math.min((currentStreak / goal.targetDays) * 100, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 pb-20"
    >
      <div className="p-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Goals 🎯
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set targets and track your progress
          </p>
        </motion.div>

        {/* Add Goal Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus size={24} />
              <span>Add New Goal</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Goals List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence>
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const isAchieved = currentStreak >= goal.targetDays || goal.isCompleted;
              
              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ${
                    isAchieved 
                      ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10' 
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-2 rounded-xl ${
                          goal.type === 'short-term' 
                            ? 'bg-blue-100 dark:bg-blue-900' 
                            : 'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          {goal.type === 'short-term' ? (
                            <Target className={`${
                              goal.type === 'short-term' 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-purple-600 dark:text-purple-400'
                            }`} size={20} />
                          ) : (
                            <Calendar className={`${
                              goal.type === 'short-term' 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-purple-600 dark:text-purple-400'
                            }`} size={20} />
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          goal.type === 'short-term'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                          {goal.type === 'short-term' ? 'Short-term' : 'Long-term'}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold mb-1 ${
                        isAchieved 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {goal.title}
                        {isAchieved && <span className="ml-2">🎉</span>}
                      </h3>
                      {goal.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>{goal.targetDays} days target</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isAchieved && !goal.isCompleted && (
                        <motion.button
                          onClick={() => onToggleGoal(goal.id)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CheckCircle size={20} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className={`font-medium ${
                        isAchieved 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {currentStreak}/{goal.targetDays} days ({Math.round(progress)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full ${
                          isAchieved 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {isAchieved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-3 bg-green-100 dark:bg-green-900/20 rounded-xl"
                    >
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        🎉 Goal Achieved! Keep going strong!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {goals.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No goals set yet. Add your first goal to get started!</p>
            </motion.div>
          )}
        </motion.div>

        {/* Add Goal Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Add New Goal
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      placeholder="e.g., Stay clean for 30 days"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      placeholder="Why is this goal important to you?"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={newGoal.targetDays}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDays: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewGoal({ ...newGoal, type: 'short-term' })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          newGoal.type === 'short-term'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Short-term
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGoal({ ...newGoal, type: 'long-term' })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          newGoal.type === 'long-term'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Long-term
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      Add Goal
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GoalSetting;