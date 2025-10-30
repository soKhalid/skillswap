import { Link } from 'react-router-dom';
import { FiSearch, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: <FiSearch size={32} />,
      title: 'Discover Skills',
      description: 'Browse thousands of skills offered by students just like you'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Connect & Learn',
      description: 'Match with peers and exchange knowledge without spending money'
    },
    {
      icon: <FiStar size={32} />,
      title: 'Earn & Teach',
      description: 'Share your expertise and earn Skill Points to learn something new'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and badges'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50+', label: 'Skill Categories' },
    { value: '25,000+', label: 'Sessions Completed' },
    { value: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Learn Any Skill,
              <br />
              <span className="text-accent-200">Without Spending Money</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Exchange skills with students worldwide. Teach what you know, learn what you want.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors">
                Get Started Free
              </Link>
              <Link to="/discover" className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                Browse Skills
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How SkillSwap Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A simple, fair, and rewarding way to learn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Start Your Journey in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up and tell us what you can teach and what you want to learn. Get 50 bonus Skill Points to start!
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Match</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse skills, connect with teachers, and book sessions. Use your Skill Points to learn.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Teach</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Attend sessions, earn points by teaching, and build your reputation through reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of students already exchanging skills on SkillSwap
          </p>
          <Link to="/signup" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors inline-block">
            Sign Up Now - It's Free!
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
