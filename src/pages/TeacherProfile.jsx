import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiCalendar, FiMessageCircle, FiAward } from 'react-icons/fi';
import { getUserBadge, getAverageRating, formatDate } from '../utils/helpers';
import { SKILL_CATEGORIES, POINTS_PER_SESSION } from '../utils/constants';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher profile
      const teacherDoc = await getDoc(doc(db, 'users', teacherId));
      if (teacherDoc.exists()) {
        setTeacher({ id: teacherDoc.id, ...teacherDoc.data() });
      }

      // Fetch reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('reviewedUserId', '==', teacherId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = [];

      for (const reviewDoc of reviewsSnapshot.docs) {
        const reviewData = reviewDoc.data();
        // Fetch reviewer info
        const reviewerDoc = await getDoc(doc(db, 'users', reviewData.reviewerId));
        reviewsData.push({
          id: reviewDoc.id,
          ...reviewData,
          reviewer: reviewerDoc.data()
        });
      }

      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!currentUser) {
      toast.error('Please log in to book a session');
      navigate('/login');
      return;
    }

    if (!selectedSkill || !selectedDate) {
      toast.error('Please select a skill and date');
      return;
    }

    if (userProfile.skillPoints < POINTS_PER_SESSION) {
      toast.error('Insufficient Skill Points');
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        teacherId: teacherId,
        studentId: currentUser.uid,
        skill: selectedSkill,
        dateTime: selectedDate.toISOString(),
        status: 'pending',
        pointsCost: POINTS_PER_SESSION,
        notes: bookingNotes,
        createdAt: new Date().toISOString()
      });

      toast.success('Booking request sent! The teacher will be notified.');
      setShowBookingModal(false);
      setSelectedSkill(null);
      setSelectedDate(null);
      setBookingNotes('');
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session');
    }
  };

  const handleStartChat = () => {
    navigate(`/messages?user=${teacherId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Teacher not found</div>
      </div>
    );
  }

  const badge = getUserBadge(teacher.sessionsTeaching || 0);
  const avgRating = getAverageRating(teacher.rating || 0, teacher.totalRatings || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Teacher Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {teacher.photoURL ? (
              <img
                src={teacher.photoURL}
                alt={teacher.displayName}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold">
                {teacher.displayName?.charAt(0) || 'U'}
              </div>
            )}
            {badge && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg" title={badge.name}>
                <span className="text-3xl">{badge.icon}</span>
              </div>
            )}
          </div>

          {/* Teacher Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{teacher.displayName}</h1>
            {teacher.university && (
              <p className="text-gray-600 dark:text-gray-400 mb-3">{teacher.university}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500" size={20} />
                <span className="font-semibold">{avgRating > 0 ? avgRating : 'New'}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({teacher.totalRatings || 0} {teacher.totalRatings === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-primary-600" size={20} />
                <span className="font-semibold">{teacher.sessionsCompleted || 0} sessions completed</span>
              </div>
            </div>

            {teacher.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{teacher.bio}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FiCalendar size={18} />
                Book a Session ({POINTS_PER_SESSION} SP)
              </button>
              <button
                onClick={handleStartChat}
                className="btn-secondary flex items-center gap-2"
              >
                <FiMessageCircle size={18} />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Offered */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Skills Offered</h2>
            <div className="space-y-3">
              {teacher.skillsOffered?.map((skill, index) => {
                const category = SKILL_CATEGORIES.find(c => c.value === skill.category);
                return (
                  <div
                    key={index}
                    className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-lg">{skill.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {category?.icon} {category?.label} • {skill.proficiency}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSkill(skill);
                        setShowBookingModal(true);
                      }}
                      className="btn-accent"
                    >
                      Book
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      {review.reviewer?.photoURL ? (
                        <img
                          src={review.reviewer.photoURL}
                          alt={review.reviewer.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                          {review.reviewer?.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.reviewer?.displayName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Wanted */}
          {teacher.skillsWanted?.length > 0 && (
            <div className="card">
              <h3 className="font-bold mb-3">Looking to Learn</h3>
              <div className="space-y-2">
                {teacher.skillsWanted.map((skill, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {SKILL_CATEGORIES.find(c => c.value === skill.category)?.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="card">
            <h3 className="font-bold mb-3">Teaching Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sessions Taught:</span>
                <span className="font-semibold">{teacher.sessionsTeaching || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
                <span className="font-semibold">{teacher.sessionsCompleted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                <span className="font-semibold">{formatDate(teacher.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Book a Session</h2>

            <div className="space-y-4">
              {/* Skill Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Skill</label>
                <select
                  value={selectedSkill?.name || ''}
                  onChange={(e) => {
                    const skill = teacher.skillsOffered.find(s => s.name === e.target.value);
                    setSelectedSkill(skill);
                  }}
                  className="input-field"
                >
                  <option value="">Choose a skill...</option>
                  {teacher.skillsOffered?.map((skill, idx) => (
                    <option key={idx} value={skill.name}>
                      {skill.name} ({skill.proficiency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Picker */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Date & Time</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="input-field"
                  placeholderText="Choose date and time..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Any specific topics you'd like to cover?"
                />
              </div>

              {/* Cost Display */}
              <div className="bg-accent-50 dark:bg-accent-900/20 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cost:</span>
                  <span className="text-xl font-bold text-accent-600 dark:text-accent-400">
                    {POINTS_PER_SESSION} SP
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your balance: {userProfile?.skillPoints || 0} SP
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={handleBookSession} className="btn-primary flex-1">
                  Confirm Booking
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedSkill(null);
                    setSelectedDate(null);
                    setBookingNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
