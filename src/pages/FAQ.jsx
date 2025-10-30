import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is SkillSwap?',
      answer: 'SkillSwap is a peer-to-peer learning platform where students exchange skills instead of money. Teach what you know, learn what you want - all without spending a dime!'
    },
    {
      question: 'How do Skill Points work?',
      answer: 'Skill Points are our internal currency. You earn 10 points for each session you teach and spend 10 points to book a session with someone else. New users get 50 bonus points to start!'
    },
    {
      question: 'Is SkillSwap really free?',
      answer: 'Yes! SkillSwap is completely free. No subscription fees, no hidden charges. You exchange skills, not money.'
    },
    {
      question: 'What if I run out of Skill Points?',
      answer: 'Simply teach more sessions to earn points! This creates a balanced ecosystem where everyone contributes. The more you teach, the more you can learn.'
    },
    {
      question: 'What kind of skills can I teach or learn?',
      answer: 'Almost anything! From programming and design to languages, music, cooking, fitness, and more. If you have knowledge to share or want to learn something, SkillSwap is for you.'
    },
    {
      question: 'How long are the sessions?',
      answer: 'Session length is flexible and agreed upon between the teacher and student. Most sessions are 1 hour, but you can customize based on your needs.'
    },
    {
      question: 'How do I schedule a session?',
      answer: 'Browse teachers, find someone offering a skill you want to learn, view their profile, and click "Book a Session." Choose a date and time that works for both of you.'
    },
    {
      question: 'How do video calls work?',
      answer: 'We integrate with Jitsi Meet for free, secure video calls. When it\'s time for your session, just click "Join Video Call" and you\'ll be connected instantly.'
    },
    {
      question: 'Can I cancel a booking?',
      answer: 'Teachers can decline booking requests before accepting them. Once accepted, both parties should honor the commitment. If you need to reschedule, message the other person directly.'
    },
    {
      question: 'What are the badges?',
      answer: 'Badges are achievements you earn as a teacher: Beginner (5 sessions), Pro (20 sessions), and Expert (50 sessions). They help students identify experienced teachers.'
    },
    {
      question: 'How does the rating system work?',
      answer: 'After each session, students can rate their teachers from 1-5 stars and leave a review. This helps build trust and helps other students find great teachers.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Yes! We use Firebase for secure authentication and data storage. Your personal information is protected, and we never share your data with third parties.'
    },
    {
      question: 'Do I need to verify my email?',
      answer: 'Yes, email verification helps us maintain a trustworthy community. You\'ll receive a verification email when you sign up.'
    },
    {
      question: 'Can I message teachers before booking?',
      answer: 'Absolutely! Use the "Message" button on a teacher\'s profile to ask questions or discuss your learning goals before booking.'
    },
    {
      question: 'What if I have a bad experience?',
      answer: 'We take quality seriously. You can leave honest reviews, and users with consistently poor ratings will be reviewed by our team. Contact us if you experience any issues.'
    },
    {
      question: 'Can I teach multiple skills?',
      answer: 'Yes! Add as many skills as you\'d like to your profile. The more you offer, the more opportunities you have to earn points and help others.'
    },
    {
      question: 'Is SkillSwap only for students?',
      answer: 'While designed with students in mind, anyone passionate about learning and teaching is welcome! Our community thrives on diversity.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simple! Sign up, complete your profile, add skills you can teach and want to learn, then start browsing or accept booking requests. You\'ll get 50 free points to begin!'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Everything you need to know about SkillSwap
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="card">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
              {openIndex === index ? (
                <FiChevronUp size={24} className="flex-shrink-0 text-primary-600 dark:text-primary-400" />
              ) : (
                <FiChevronDown size={24} className="flex-shrink-0 text-gray-400" />
              )}
            </button>

            {openIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 card text-center bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
        <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We're here to help! Reach out to our support team.
        </p>
        <a
          href="mailto:support@skillswap.com"
          className="btn-primary inline-block"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;
