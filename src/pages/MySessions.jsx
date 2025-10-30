import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiX, FiStar, FiVideo, FiMessageCircle } from 'react-icons/fi';
import { formatDateTime } from '../utils/helpers';
import { POINTS_PER_SESSION, BOOKING_STATUS } from '../utils/constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MySessions = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, requests
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchSessions();
    }
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      // Fetch sessions where user is student
      const studentQuery = query(
        collection(db, 'bookings'),
        where('studentId', '==', currentUser.uid)
      );
      const studentSnapshot = await getDocs(studentQuery);

      // Fetch sessions where user is teacher
      const teacherQuery = query(
        collection(db, 'bookings'),
        where('teacherId', '==', currentUser.uid)
      );
      const teacherSnapshot = await getDocs(teacherQuery);

      const allSessions = [];

      // Process student sessions
      for (const bookingDoc of studentSnapshot.docs) {
        const bookingData = bookingDoc.data();
        const teacherDoc = await getDoc(doc(db, 'users', bookingData.teacherId));
        allSessions.push({
          id: bookingDoc.id,
          ...bookingData,
          role: 'student',
          otherUser: teacherDoc.data()
        });
      }

      // Process teacher sessions
      for (const bookingDoc of teacherSnapshot.docs) {
        const bookingData = bookingDoc.data();
        const studentDoc = await getDoc(doc(db, 'users', bookingData.studentId));
        allSessions.push({
          id: bookingDoc.id,
          ...bookingData,
          role: 'teacher',
          otherUser: studentDoc.data()
        });
      }

      // Separate requests (pending bookings where user is teacher)
      const pendingRequests = allSessions.filter(
        s => s.status === BOOKING_STATUS.PENDING && s.role === 'teacher'
      );

      setSessions(allSessions);
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (sessionId) => {
    try {
      await updateDoc(doc(db, 'bookings', sessionId), {
        status: BOOKING_STATUS.ACCEPTED
      });
      toast.success('Session accepted!');
      fetchSessions();
    } catch (error) {
      console.error('Error accepting session:', error);
      toast.error('Failed to accept session');
    }
  };

  const handleRejectRequest = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);

      // Refund points to student
      const studentRef = doc(db, 'users', session.studentId);
      const studentDoc = await getDoc(studentRef);
      const currentPoints = studentDoc.data().skillPoints || 0;

      await updateDoc(studentRef, {
        skillPoints: currentPoints + POINTS_PER_SESSION
      });

      await updateDoc(doc(db, 'bookings', sessionId), {
        status: BOOKING_STATUS.CANCELLED
      });

      toast.success('Session cancelled and points refunded');
      fetchSessions();
    } catch (error) {
      console.error('Error rejecting session:', error);
      toast.error('Failed to cancel session');
    }
  };

  const handleCompleteSession = async (session) => {
    try {
      // Update booking status
      await updateDoc(doc(db, 'bookings', session.id), {
        status: BOOKING_STATUS.COMPLETED,
        completedAt: new Date().toISOString()
      });

      // If user is student, deduct points
      if (session.role === 'student') {
        await updateUserProfile(currentUser.uid, {
          skillPoints: (userProfile.skillPoints || 0) - POINTS_PER_SESSION,
          sessionsCompleted: (userProfile.sessionsCompleted || 0) + 1
        });
      }

      // If user is teacher, add points
      if (session.role === 'teacher') {
        await updateUserProfile(currentUser.uid, {
          skillPoints: (userProfile.skillPoints || 0) + POINTS_PER_SESSION,
          sessionsCompleted: (userProfile.sessionsCompleted || 0) + 1,
          sessionsTeaching: (userProfile.sessionsTeaching || 0) + 1
        });
      }

      // Update other user's session count
      const otherUserRef = doc(db, 'users', session.role === 'teacher' ? session.studentId : session.teacherId);
      const otherUserDoc = await getDoc(otherUserRef);
      const otherUserData = otherUserDoc.data();

      await updateDoc(otherUserRef, {
        sessionsCompleted: (otherUserData.sessionsCompleted || 0) + 1,
        ...(session.role === 'student' && {
          sessionsTeaching: (otherUserData.sessionsTeaching || 0) + 1
        })
      });

      toast.success('Session completed!');
      setSelectedSession(session);
      setShowReviewModal(true);
      fetchSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedSession) return;

    try {
      const reviewedUserId = selectedSession.role === 'student'
        ? selectedSession.teacherId
        : selectedSession.studentId;

      // Add review
      await addDoc(collection(db, 'reviews'), {
        reviewerId: currentUser.uid,
        reviewedUserId: reviewedUserId,
        bookingId: selectedSession.id,
        rating: rating,
        comment: reviewComment,
        createdAt: new Date().toISOString()
      });

      // Update reviewed user's rating
      const reviewedUserRef = doc(db, 'users', reviewedUserId);
      const reviewedUserDoc = await getDoc(reviewedUserRef);
      const reviewedUserData = reviewedUserDoc.data();

      await updateDoc(reviewedUserRef, {
        rating: (reviewedUserData.rating || 0) + rating,
        totalRatings: (reviewedUserData.totalRatings || 0) + 1
      });

      toast.success('Review submitted!');
      setShowReviewModal(false);
      setRating(5);
      setReviewComment('');
      setSelectedSession(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const getFilteredSessions = () => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return sessions.filter(
          s => s.status === BOOKING_STATUS.ACCEPTED && new Date(s.dateTime) > now
        );
      case 'past':
        return sessions.filter(
          s => s.status === BOOKING_STATUS.COMPLETED || new Date(s.dateTime) < now
        );
      case 'requests':
        return requests;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading sessions...</div>
      </div>
    );
  }

  const filteredSessions = getFilteredSessions();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Sessions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your learning and teaching sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'past'
              ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Past Sessions
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors relative ${
            activeTab === 'requests'
              ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Requests
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex flex-col md:flex-row gap-4">
                {/* User Avatar */}
                <div>
                  {session.otherUser?.photoURL ? (
                    <img
                      src={session.otherUser.photoURL}
                      alt={session.otherUser.displayName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
                      {session.otherUser?.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                {/* Session Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{session.skill.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {session.role === 'teacher' ? 'Teaching to' : 'Learning from'} {session.otherUser?.displayName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === BOOKING_STATUS.PENDING
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : session.status === BOOKING_STATUS.ACCEPTED
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {session.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {formatDateTime(session.dateTime)}
                  </p>

                  {session.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Notes: {session.notes}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {activeTab === 'requests' && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(session.id)}
                          className="btn-primary flex items-center gap-2"
                        >
                          <FiCheck size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(session.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FiX size={16} />
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab === 'upcoming' && (
                      <>
                        <a
                          href={`https://meet.jit.si/skillswap-${session.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex items-center gap-2"
                        >
                          <FiVideo size={16} />
                          Join Video Call
                        </a>
                        <button
                          onClick={() => navigate(`/messages?user=${session.role === 'teacher' ? session.studentId : session.teacherId}`)}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <FiMessageCircle size={16} />
                          Message
                        </button>
                        <button
                          onClick={() => handleCompleteSession(session)}
                          className="btn-accent flex items-center gap-2"
                        >
                          <FiCheck size={16} />
                          Mark Complete
                        </button>
                      </>
                    )}

                    {activeTab === 'past' && session.status === BOOKING_STATUS.COMPLETED && (
                      <button
                        onClick={() => {
                          setSelectedSession(session);
                          setShowReviewModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FiStar size={16} />
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            {activeTab === 'upcoming' && 'No upcoming sessions'}
            {activeTab === 'past' && 'No past sessions'}
            {activeTab === 'requests' && 'No pending requests'}
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            {activeTab === 'requests'
              ? 'New booking requests will appear here'
              : 'Book a session to get started'}
          </p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>

            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                How was your session with {selectedSession.otherUser?.displayName}?
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-colors"
                  >
                    <FiStar
                      className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleSubmitReview} className="btn-primary flex-1">
                Submit Review
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setReviewComment('');
                  setSelectedSession(null);
                }}
                className="btn-secondary flex-1"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessions;
