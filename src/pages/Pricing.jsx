import { Link } from 'react-router-dom';
import { FiCheck, FiStar, FiZap, FiAward } from 'react-icons/fi';

const Pricing = () => {
  const plans = [
    {
      name: 'Silver',
      icon: <FiStar size={40} />,
      price: '9.99',
      period: 'month',
      description: 'Perfect for casual learners',
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-300 dark:border-gray-600',
      buttonClass: 'bg-gray-500 hover:bg-gray-600',
      features: [
        'Access to all skills',
        '50 Skill Points per month',
        'Book up to 5 sessions/month',
        'Real-time chat messaging',
        'Video call integration',
        'Basic profile customization',
        'Community support',
        'Standard badge progression'
      ]
    },
    {
      name: 'Gold',
      icon: <FiZap size={40} />,
      price: '19.99',
      period: 'month',
      description: 'For dedicated skill builders',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-400 dark:border-yellow-600',
      buttonClass: 'bg-yellow-500 hover:bg-yellow-600',
      popular: true,
      features: [
        'Everything in Silver',
        '150 Skill Points per month',
        'Unlimited session bookings',
        'Priority support',
        'Advanced profile customization',
        'Featured teacher badge',
        'Analytics dashboard',
        'Early access to new features',
        'No ads',
        '10% bonus on earned points'
      ]
    },
    {
      name: 'Platinum',
      icon: <FiAward size={40} />,
      price: '39.99',
      period: 'month',
      description: 'Ultimate learning experience',
      color: 'from-purple-400 via-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-400 dark:border-purple-600',
      buttonClass: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      features: [
        'Everything in Gold',
        '500 Skill Points per month',
        'VIP teacher verification',
        'Premium profile badge',
        'Dedicated account manager',
        'Custom skill categories',
        'Group session hosting',
        '1-on-1 career coaching',
        'Certificate of completion',
        'API access',
        '25% bonus on earned points',
        'Lifetime achievement badges'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unlock premium features and supercharge your learning journey with our flexible subscription plans
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border-2 ${plan.borderColor} ${plan.bgColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.popular ? 'md:-mt-4 md:mb-4' : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            {/* Icon */}
            <div className={`mb-6 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
              {plan.icon}
            </div>

            {/* Plan Name */}
            <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-5xl font-bold">${plan.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
            </div>

            {/* CTA Button */}
            <Link
              to="/signup"
              className={`block w-full text-center text-white font-bold py-3 px-6 rounded-lg transition-colors ${plan.buttonClass} mb-6`}
            >
              Get Started
            </Link>

            {/* Features List */}
            <div className="space-y-3">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
                What's included:
              </p>
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FiCheck className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">Can I switch plans anytime?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">What happens to my Skill Points if I cancel?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your earned Skill Points remain in your account forever. Monthly bonus points expire at the end of each billing cycle.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All new users get 50 free Skill Points to try the platform. You can start learning right away without a subscription!
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-2">Do you offer student discounts?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! Students with valid .edu email addresses get 20% off all plans. Verify your student status during signup.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our team is here to help you choose the right plan for your learning goals
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/faq" className="btn-secondary">
            View FAQ
          </Link>
          <a href="mailto:support@skillswap.com" className="btn-primary">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
