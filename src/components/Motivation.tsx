import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Lightbulb, Heart, Zap, Target, BookOpen } from 'lucide-react';
import { getRandomQuote, getTodaysQuote } from '../utils/motivationalQuotes';

const Motivation: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(getTodaysQuote());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    setCurrentQuote(getRandomQuote());
    setIsRefreshing(false);
  };

  const tips = [
    {
      icon: Zap,
      title: "Channel Your Energy",
      content: "Redirect urges into productive activities like exercise, reading, or learning a new skill.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Target,
      title: "Focus on Your Why",
      content: "Remember the reasons you started this journey. Write them down and review them daily.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Heart,
      title: "Practice Self-Compassion",
      content: "Be kind to yourself. Recovery is a journey with ups and downs, not a straight line.",
      color: "from-pink-400 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Educate Yourself",
      content: "Learn about the science behind addiction and recovery. Knowledge is power.",
      color: "from-green-400 to-teal-500"
    }
  ];

  const benefits = [
    "Increased energy and motivation",
    "Better sleep quality",
    "Improved focus and concentration",
    "Enhanced self-confidence",
    "Stronger relationships",
    "Better emotional regulation",
    "Increased productivity",
    "Greater sense of self-control"
  ];

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
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pb-20"
    >
      <div className="p-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Motivation Hub ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Daily inspiration to keep you going
          </p>
        </motion.div>

        {/* Quote Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Lightbulb size={24} />
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white/20 rounded-xl transition-colors hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw size={20} />
            </motion.button>
          </div>
          
          <motion.div
            key={currentQuote.quote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="text-lg leading-relaxed mb-4 italic">
              "{currentQuote.quote}"
            </blockquote>
            <p className="text-purple-100">— {currentQuote.author}</p>
            
            {currentQuote.tip && (
              <div className="mt-4 p-4 bg-white/10 rounded-xl">
                <p className="text-sm font-medium mb-2">💡 Actionable Tip:</p>
                <p className="text-sm">{currentQuote.tip}</p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Tips Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Practical Tips
          </h2>
          <div className="space-y-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${tip.color} rounded-xl`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Benefits You'll Experience
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Encouragement Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg text-center"
        >
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-xl font-bold mb-2">You're Doing Amazing!</h3>
          <p className="text-green-100 leading-relaxed">
            Every moment you choose recovery over relapse is a victory. 
            Your future self will thank you for the strength you're showing today.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Motivation;