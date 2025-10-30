import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          About SkillSwap
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Empowering students to learn and teach without spending money
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          SkillSwap is a peer-to-peer learning platform that makes education accessible to everyone.
          We believe that every student has valuable knowledge to share and something new to learn.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          By creating a community where skills are exchanged instead of bought,
          we're breaking down financial barriers to learning and fostering a culture of collaboration
          and mutual growth.
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">How SkillSwap Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Share Your Skills</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create a profile listing skills you can teach. Everyone has something valuable to share!
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp size={32} className="text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Earn Skill Points</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Teach sessions to earn Skill Points. Use these points to book sessions with other teachers.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Learn & Grow</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book sessions with other students to learn new skills. It's a win-win for everyone!
            </p>
          </div>
        </div>
      </div>

      {/* The Skill Points System */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold mb-4">The Skill Points System</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">New User Bonus</h3>
              <p>Get 50 Skill Points when you sign up to start learning right away</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Earn by Teaching</h3>
              <p>Earn 10 Skill Points for every session you teach</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Spend to Learn</h3>
              <p>Use 10 Skill Points to book a session with any teacher</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Build Your Reputation</h3>
              <p>Earn badges and positive reviews as you teach more sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why SkillSwap */}
      <div className="card mb-12">
        <h2 className="text-3xl font-bold mb-4">Why SkillSwap?</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span><strong>No Money Required:</strong> Learn valuable skills without paying fees</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span><strong>Peer-to-Peer Learning:</strong> Learn from students who understand your challenges</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span><strong>Build Connections:</strong> Network with students across different universities</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span><strong>Flexible Scheduling:</strong> Learn at times that work for you</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span><strong>Diverse Skills:</strong> From coding to cooking, guitar to graphic design</span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Join thousands of students already learning and teaching on SkillSwap
        </p>
        <Link to="/signup" className="btn-primary inline-block text-lg px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
};

export default About;
