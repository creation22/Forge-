import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, BarChart3, BookOpen } from 'lucide-react';
import { DailyLog, UserStats } from '../types';

interface HistoryProps {
  logs: DailyLog[];
  stats: UserStats;
}

const History: React.FC<HistoryProps> = ({ logs, stats }) => {
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const log = logs.find(l => l.date === date);
      return {
        date,
        relapsed: log?.relapsed || false,
        relapseCount: log?.relapseCount || 0,
        urgeLevel: log?.urgeLevel || 0,
        mood: log?.mood || 5
      };
    });
  }, [logs]);

  const weeklyStats = useMemo(() => {
    const lastWeek = logs.filter(log => {
      const logDate = new Date(log.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    });

    const totalRelapses = lastWeek.reduce((sum, log) => sum + (log.relapseCount || 0), 0);
    const avgMood = lastWeek.length > 0 
      ? lastWeek.reduce((sum, log) => sum + log.mood, 0) / lastWeek.length 
      : 5;
    const avgUrge = lastWeek.length > 0
      ? lastWeek.reduce((sum, log) => sum + log.urgeLevel, 0) / lastWeek.length
      : 0;

    return { totalRelapses, avgMood, avgUrge };
  }, [logs]);

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

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤩', '🥳', '🌟', '✨'];
    return emojis[mood - 1] || '😐';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 pb-20"
    >
      <div className="p-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Journey 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress over time
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Logs</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {logs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {logs.length > 0 
                    ? Math.round(((logs.length - logs.filter(l => l.relapsed).length) / logs.length) * 100)
                    : 100
                  }%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{weeklyStats.totalRelapses}</div>
              <div className="text-indigo-100 text-sm">Relapses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{getMoodEmoji(Math.round(weeklyStats.avgMood))}</div>
              <div className="text-indigo-100 text-sm">Avg Mood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(weeklyStats.avgUrge)}/10</div>
              <div className="text-indigo-100 text-sm">Avg Urge</div>
            </div>
          </div>
        </motion.div>

        {/* Visual Chart */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-gray-600 dark:text-gray-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Last 30 Days
            </h2>
          </div>
          
          <div className="space-y-2">
            {chartData.slice(-7).map((day, index) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const maxHeight = 40;
              const urgeHeight = (day.urgeLevel / 10) * maxHeight;
              
              return (
                <div key={day.date} className="flex items-center space-x-3">
                  <div className="w-8 text-xs text-gray-600 dark:text-gray-400">
                    {dayName}
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded h-8 flex items-end p-1">
                      {day.urgeLevel > 0 && (
                        <motion.div
                          className={`w-full rounded ${
                            day.relapsed ? 'bg-red-400' : 'bg-blue-400'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: `${urgeHeight}px` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      )}
                    </div>
                    <div className="text-lg">
                      {day.mood > 0 ? getMoodEmoji(day.mood) : '⚫'}
                    </div>
                    {day.relapsed && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>🔵 Urge Level</span>
            <span>😊 Mood</span>
            <span>🔴 Relapse</span>
          </div>
        </motion.div>

        {/* Recent Logs */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Entries
          </h2>
          
          {logs.slice(-5).reverse().map((log, index) => (
            <motion.div
              key={log.id}
              variants={itemVariants}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border ${
                log.relapsed 
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Mood:</span>
                      <span className="text-lg">{getMoodEmoji(log.mood)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Urge:</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {log.urgeLevel}/10
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.relapsed
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                }`}>
                  {log.relapsed ? `Relapsed (${log.relapseCount}x)` : 'Success'}
                </div>
              </div>
              
              {log.notes && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <BookOpen className="text-gray-400 mt-0.5" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {log.notes}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {logs.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>No logs yet. Start tracking your journey!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default History;