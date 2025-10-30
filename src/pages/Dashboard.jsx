import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiTrendingUp,
  FiAward,
  FiClock,
  FiDollarSign,
  FiBookOpen,
  FiUsers,
  FiCalendar
} from 'react-icons/fi';
import { getUserBadge, formatDateTime } from '../utils/helpers';
import { POINTS_PER_SESSION } from '../utils/constants';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming bookings
      const upcomingQuery = query(
        collection(db, 'bookings'),
        where('studentId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      );
      const upcomingSnapshot = await getDocs(upcomingQuery);
      const upcoming = [];

      for (const bookingDoc of upcomingSnapshot.docs) {
        const bookingData = bookingDoc.data();
        const teacherDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', bookingData.teacherId)));
        if (!teacherDoc.empty) {
          upcoming.push({
            id: bookingDoc.id,
            ...bookingData,
            teacher: teacherDoc.docs[0].data()
          });
        }
      }

      // Sort by date
      upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      setUpcomingSessions(upcoming.filter(s => new Date(s.dateTime) > new Date()).slice(0, 5));

      // Fetch recent completed sessions
      const recentQuery = query(
        collection(db, 'bookings'),
        where('status', '==', 'completed')
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recent = [];

      for (const bookingDoc of recentSnapshot.docs) {
        const bookingData = bookingDoc.data();
        if (bookingData.studentId === currentUser.uid || bookingData.teacherId === currentUser.uid) {
          const otherUserId = bookingData.studentId === currentUser.uid ? bookingData.teacherId : bookingData.studentId;
          const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', otherUserId)));
          if (!userDoc.empty) {
            recent.push({
              id: bookingDoc.id,
              ...bookingData,
              otherUser: userDoc.docs[0].data(),
              role: bookingData.studentId === currentUser.uid ? 'student' : 'teacher'
            });
          }
        }
      }

      recent.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      setRecentSessions(recent.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const badge = getUserBadge(userProfile?.sessionsTeaching || 0);

  const stats = [
    {
      label: 'Skill Points',
      value: userProfile?.skillPoints || 0,
      icon: <FiDollarSign size={24} />,
      color: 'bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
    },
    {
      label: 'Sessions Completed',
      value: userProfile?.sessionsCompleted || 0,
      icon: <FiBookOpen size={24} />,
      color: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
    },
    {
      label: 'Sessions Taught',
      value: userProfile?.sessionsTeaching || 0,
      icon: <FiUsers size={24} />,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    },
    {
      label: 'Total Hours',
      value: ((userProfile?.sessionsCompleted || 0) * 1).toFixed(1),
      icon: <FiClock size={24} />,
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {userProfile?.displayName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your learning journey overview
          </p>
        </div>
        {badge && (
          <div className="text-center">
            <div className="text-5xl mb-1">{badge.icon}</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {badge.name}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            <Link to="/my-sessions" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
              View all
            </Link>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    {session.teacher?.photoURL ? (
                      <img
                        src={session.teacher.photoURL}
                        alt={session.teacher.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                        {session.teacher?.displayName?.charAt(0) || 'T'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.skill.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        with {session.teacher?.displayName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <FiClock size={12} />
                        {formatDateTime(session.dateTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiCalendar size={48} className="mx-auto mb-2 opacity-50" />
              <p>No upcoming sessions</p>
              <Link to="/discover" className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block">
                Book a session
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    {session.otherUser?.photoURL ? (
                      <img
                        src={session.otherUser.photoURL}
                        alt={session.otherUser.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                        {session.otherUser?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.skill.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.role === 'teacher' ? 'Taught to' : 'Learned from'} {session.otherUser?.displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(session.dateTime)}
                        </span>
                        {session.role === 'teacher' && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                            +{POINTS_PER_SESSION} SP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiTrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>No activity yet</p>
              <p className="text-sm mt-2">Start learning or teaching to see your activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link to="/discover" className="card hover:scale-105 transition-transform text-center">
          <FiBookOpen size={32} className="mx-auto mb-2 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold mb-1">Discover Skills</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Find your next learning opportunity</p>
        </Link>

        <Link to="/profile" className="card hover:scale-105 transition-transform text-center">
          <FiAward size={32} className="mx-auto mb-2 text-accent-600 dark:text-accent-400" />
          <h3 className="font-semibold mb-1">Update Skills</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add or edit your teaching skills</p>
        </Link>

        <Link to="/my-sessions" className="card hover:scale-105 transition-transform text-center">
          <FiUsers size={32} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold mb-1">My Sessions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your sessions</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
