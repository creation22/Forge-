import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import GoalSetting from './components/GoalSetting';
import Motivation from './components/Motivation';
import History from './components/History';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DailyLog, Goal, UserStats } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  
  // User stats
  const [stats, setStats] = useLocalStorage<UserStats>('userStats', {
    currentStreak: 0,
    longestStreak: 0,
    totalRelapses: 0,
    startDate: new Date().toISOString(),
    lastLogDate: undefined
  });

  // Daily logs
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('dailyLogs', []);
  
  // Goals
  const [goals, setGoals] = useLocalStorage<Goal[]>('userGoals', []);

  // Check if user has logged today
  const hasLoggedToday = (() => {
    const today = new Date().toISOString().split('T')[0];
    return logs.some(log => log.date === today);
  })();

  // Calculate current streak
  useEffect(() => {
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (from today backwards)
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      
      if (!log) {
        // If we haven't logged for this date, stop counting current streak only if it's not today
        if (checkDate.toDateString() !== today.toDateString()) {
          break;
        }
      } else if (log.relapsed) {
        // If relapsed, current streak stops
        break;
      } else {
        // Clean day, increment streak
        currentStreak++;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
      
      // Don't go back more than the total number of logs + a reasonable buffer
      if (currentStreak > logs.length + 30) break;
    }

    // Calculate longest streak
    for (const log of sortedLogs) {
      if (!log.relapsed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const totalRelapses = logs.reduce((sum, log) => sum + (log.relapseCount || 0), 0);

    setStats(prev => ({
      ...prev,
      currentStreak,
      longestStreak: Math.max(longestStreak, prev.longestStreak),
      totalRelapses
    }));
  }, [logs, setStats]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogSubmit = (logData: {
    relapsed: boolean;
    relapseCount: number;
    urgeLevel: number;
    mood: number;
    notes?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: today,
      ...logData
    };

    setLogs(prev => {
      // Remove any existing log for today and add the new one
      const filtered = prev.filter(log => log.date !== today);
      return [...filtered, newLog];
    });

    setStats(prev => ({
      ...prev,
      lastLogDate: today
    }));
  };

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
    ));
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            onLogSubmit={handleLogSubmit}
            hasLoggedToday={hasLoggedToday}
          />
        );
      case 'goals':
        return (
          <GoalSetting 
            goals={goals}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onToggleGoal={handleToggleGoal}
            currentStreak={stats.currentStreak}
          />
        );
      case 'motivation':
        return <Motivation />;
      case 'history':
        return <History logs={logs} stats={stats} />;
      default:
        return (
          <Dashboard 
            stats={stats} 
            onLogSubmit={handleLogSubmit}
            hasLoggedToday={hasLoggedToday}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? (
          <Sun className="text-yellow-500\" size={20} />
        ) : (
          <Moon className="text-gray-600" size={20} />
        )}
      </motion.button>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {renderActiveTab()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;