export interface DailyLog {
  id: string;
  date: string;
  relapsed: boolean;
  relapseCount: number;
  urgeLevel: number;
  mood: number;
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  createdAt: string;
  isCompleted: boolean;
  type: 'short-term' | 'long-term';
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalRelapses: number;
  startDate: string;
  lastLogDate?: string;
}

export interface MotivationalContent {
  quote: string;
  author: string;
  tip?: string;
}