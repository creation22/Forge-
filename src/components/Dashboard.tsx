import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Plus, BookOpen } from 'lucide-react';
import { UserStats, MotivationalContent } from '../types';
import { getTodaysQuote } from '../utils/motivationalQuotes';
import DailyLogModal from './DailyLogModal';

interface DashboardProps {
  stats: UserStats;
  onLogSubmit: (logData: any) => void;
  hasLoggedToday: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onLogSubmit, hasLoggedToday }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const todaysQuote = getTodaysQuote();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pb-20"
    >
      <div className="p-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stay Strong 💪
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Every day is a new victory
          </p>
        </motion.div>

        {/* Current Streak Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Current Streak</p>
              <motion.div
                className="text-4xl font-bold"
                key={stats.currentStreak}
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ duration: 0.5 }}
              >
                {stats.currentStreak}
              </motion.div>
              <p className="text-blue-100 text-sm">
                {stats.currentStreak === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div className="text-4xl">
              <Flame className="text-orange-300" size={48} />
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.longestStreak}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Journey</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.floor((new Date().getTime() - new Date(stats.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Log Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.button
            onClick={() => setShowLogModal(true)}
            disabled={hasLoggedToday}
            className={`w-full p-4 rounded-2xl font-semibold text-lg shadow-sm transition-all ${
              hasLoggedToday
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            whileHover={hasLoggedToday ? {} : { scale: 1.02 }}
            whileTap={hasLoggedToday ? {} : { scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-2">
              {hasLoggedToday ? (
                <>
                  <BookOpen size={24} />
                  <span>Already Logged Today ✓</span>
                </>
              ) : (
                <>
                  <Plus size={24} />
                  <span>Log Today's Progress</span>
                </>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* Motivation Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Daily Motivation</h3>
              <blockquote className="text-sm leading-relaxed mb-3 italic">
                "{todaysQuote.quote}"
              </blockquote>
              <p className="text-xs text-orange-100">— {todaysQuote.author}</p>
              {todaysQuote.tip && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl">
                  <p className="text-sm font-medium mb-1">💡 Today's Tip:</p>
                  <p className="text-sm">{todaysQuote.tip}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Log Modal */}
      <DailyLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSubmit={onLogSubmit}
      />
    </motion.div>
  );
};

export default Dashboard;