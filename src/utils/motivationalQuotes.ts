import { MotivationalContent } from '../types';

export const motivationalQuotes: MotivationalContent[] = [
  {
    quote: "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.",
    author: "Anonymous",
    tip: "Remember that every day you resist is a victory worth celebrating."
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    tip: "Focus on your long-term goals when urges arise."
  },
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    tip: "Practice mindfulness when facing difficult moments."
  },
  {
    quote: "The pain of discipline weighs ounces while the pain of regret weighs tons.",
    author: "Jim Rohn",
    tip: "Channel your energy into productive activities like exercise or hobbies."
  },
  {
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    tip: "Take it one day at a time. Every day counts."
  },
  {
    quote: "Your future self is counting on your present self to make the right choice.",
    author: "Anonymous",
    tip: "Visualize the person you want to become."
  },
  {
    quote: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    tip: "Progress, not perfection, is the goal."
  },
  {
    quote: "Champions keep playing until they get it right.",
    author: "Billie Jean King",
    tip: "If you slip up, get back on track immediately."
  }
];

export const getRandomQuote = (): MotivationalContent => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

export const getTodaysQuote = (): MotivationalContent => {
  const today = new Date().toDateString();
  const hash = today.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % motivationalQuotes.length;
  return motivationalQuotes[index];
};