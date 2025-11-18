import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiBell, FiCheck, FiX, FiMessageCircle, FiCalendar } from 'react-icons/fi';
import { formatDateTime } from '../utils/helpers';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const notifs = [];

      // Fetch pending booking requests (where user is teacher)
      const bookingRequestsQuery = query(
        collection(db, 'bookings'),
        where('teacherId', '==', currentUser.uid),
        where('status', '==', 'pending')
      );
      const bookingSnapshot = await getDocs(bookingRequestsQuery);

      for (const bookingDoc of bookingSnapshot.docs) {
        const bookingData = bookingDoc.data();
        const studentDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', bookingData.studentId)));
        if (!studentDoc.empty) {
          notifs.push({
            id: bookingDoc.id,
            type: 'booking_request',
            title: 'New Booking Request',
            message: `${studentDoc.docs[0].data().displayName} wants to learn ${bookingData.skill.name}`,
            time: bookingData.createdAt,
            link: '/my-sessions',
            icon: <FiCalendar className="text-blue-500" />
          });
        }
      }

      // Fetch accepted bookings (where user is student)
      const acceptedBookingsQuery = query(
        collection(db, 'bookings'),
        where('studentId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      );
      const acceptedSnapshot = await getDocs(acceptedBookingsQuery);

      for (const bookingDoc of acceptedSnapshot.docs) {
        const bookingData = bookingDoc.data();
        // Only show if booking date is in the future
        if (new Date(bookingData.dateTime) > new Date()) {
          const teacherDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', bookingData.teacherId)));
          if (!teacherDoc.empty) {
            notifs.push({
              id: bookingDoc.id,
              type: 'booking_accepted',
              title: 'Booking Confirmed',
              message: `Your session with ${teacherDoc.docs[0].data().displayName} is confirmed for ${formatDateTime(bookingData.dateTime)}`,
              time: bookingData.createdAt,
              link: '/my-sessions',
              icon: <FiCheck className="text-green-500" />
            });
          }
        }
      }

      // Sort by time (newest first)
      notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FiBell size={32} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-4xl font-bold">Notifications</h1>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Link
              key={notif.id}
              to={notif.link}
              className="card hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {notif.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{notif.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{notif.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {formatDateTime(notif.time)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <FiBell size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No notifications</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You're all caught up! Notifications about bookings and messages will appear here.
          </p>
          <Link to="/discover" className="btn-primary inline-block">
            Discover Skills
          </Link>
        </div>
      )}
    </div>
  );
};

export default Notifications;
