import { BADGES } from './constants';

export const getUserBadge = (sessionsCompleted) => {
  if (sessionsCompleted >= BADGES.EXPERT.sessions) return BADGES.EXPERT;
  if (sessionsCompleted >= BADGES.PRO.sessions) return BADGES.PRO;
  if (sessionsCompleted >= BADGES.BEGINNER.sessions) return BADGES.BEGINNER;
  return null;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getAverageRating = (rating, totalRatings) => {
  if (totalRatings === 0) return 0;
  return (rating / totalRatings).toFixed(1);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generateChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join('_');
};
