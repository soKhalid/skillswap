import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar } from 'react-icons/fi';
import { SKILL_CATEGORIES } from '../utils/constants';
import { getUserBadge, getAverageRating } from '../utils/helpers';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('teach'); // 'teach' or 'learn'

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedCategory, viewMode, users]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter users who have skills to teach
      const teachingUsers = usersData.filter(user =>
        user.skillsOffered && user.skillsOffered.length > 0
      );

      setUsers(teachingUsers);
      setFilteredUsers(teachingUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const skillsToSearch = viewMode === 'teach' ? user.skillsOffered : user.skillsWanted;
        return (
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skillsToSearch?.some(skill =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(user => {
        const skillsToSearch = viewMode === 'teach' ? user.skillsOffered : user.skillsWanted;
        return skillsToSearch?.some(skill => skill.category === selectedCategory);
      });
    }

    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover Skills</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find the perfect teacher for your next learning adventure
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by skill or teacher name..."
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {SKILL_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('teach')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'teach'
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Skills to Learn
            </button>
            <button
              onClick={() => setViewMode('learn')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'learn'
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Skills to Teach
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        Found {filteredUsers.length} {filteredUsers.length === 1 ? 'teacher' : 'teachers'}
      </div>

      {/* User Cards Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const badge = getUserBadge(user.sessionsTeaching || 0);
            const avgRating = getAverageRating(user.rating || 0, user.totalRatings || 0);
            const skillsToShow = viewMode === 'teach' ? user.skillsOffered : user.skillsWanted;

            return (
              <Link
                key={user.id}
                to={`/teacher/${user.id}`}
                className="card hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Profile Picture */}
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    {badge && (
                      <span className="absolute -top-1 -right-1 text-xl" title={badge.name}>
                        {badge.icon}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{user.displayName}</h3>
                    {user.university && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {user.university}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-yellow-600">
                        <FiStar size={14} />
                        {avgRating > 0 ? avgRating : 'New'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {user.sessionsCompleted || 0} sessions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {viewMode === 'teach' ? 'Can teach:' : 'Wants to learn:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsToShow?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {skillsToShow?.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                        +{skillsToShow.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio Preview */}
                {user.bio && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {user.bio}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No teachers found matching your criteria.
          </p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default Discover;
