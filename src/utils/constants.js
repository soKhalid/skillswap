export const SKILL_CATEGORIES = [
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'coding', label: 'Coding & Programming', icon: '💻' },
  { value: 'languages', label: 'Languages', icon: '🌍' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'business', label: 'Business & Marketing', icon: '📊' },
  { value: 'writing', label: 'Writing & Content', icon: '✍️' },
  { value: 'photography', label: 'Photography & Video', icon: '📷' },
  { value: 'fitness', label: 'Fitness & Sports', icon: '⚽' },
  { value: 'cooking', label: 'Cooking & Baking', icon: '🍳' },
  { value: 'crafts', label: 'Arts & Crafts', icon: '🎭' },
  { value: 'science', label: 'Science & Math', icon: '🔬' },
  { value: 'other', label: 'Other', icon: '📚' }
];

export const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BADGES = {
  BEGINNER: { name: 'Beginner Teacher', sessions: 5, icon: '🌱', color: 'green' },
  PRO: { name: 'Pro Teacher', sessions: 20, icon: '⭐', color: 'blue' },
  EXPERT: { name: 'Expert Teacher', sessions: 50, icon: '👑', color: 'yellow' }
};

export const POINTS_PER_SESSION = 10;
export const INITIAL_BONUS_POINTS = 50;
