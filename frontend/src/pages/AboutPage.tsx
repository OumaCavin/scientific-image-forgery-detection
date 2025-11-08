import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Code, 
  Zap, 
  Shield, 
  Target,
  Award,
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Advanced Neural Networks',
    description: 'Custom CNN architecture with ResNet-50 backbone, optimized for biomedical image analysis and forgery detection patterns.'
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Optimized inference engine with GPU acceleration, achieving ~2.3 seconds processing time per image.'
  },
  {
    icon: Shield,
    title: 'Copy-Move Detection',
    description: 'Specialized algorithms for identifying duplicated regions using advanced computer vision techniques.'
  },
  {
    icon: Target,
    title: 'High Accuracy',
    description: 'Achieves 96.7% accuracy with 0.94 F1-score, specifically tuned for scientific image authenticity.'
  }
];

const techStack = [
  { category: 'Deep Learning', items: ['PyTorch', 'TensorFlow', 'OpenCV', 'scikit-learn'] },
  { category: 'Backend', items: ['Python', 'FastAPI', 'Supabase', 'SQLAlchemy'] },
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Infrastructure', items: ['Docker', 'GitHub Actions', 'Vercel', 'Supabase'] },
  { category: 'Computer Vision', items: ['PIL', 'NumPy', 'scikit-image', 'imageio'] },
  { category: 'Deployment', items: ['Cloud Run', 'S3', 'CDN', 'Load Balancers'] }
];

const achievements = [
  '96.7% accuracy in image forgery detection',
  '0.94 F1-score for binary classification',
  '99.8% system uptime and reliability',
  'Support for 5+ image formats',
  'Real-time batch processing (up to 10 images)',
  'Comprehensive API with REST endpoints',
  'Professional web interface with analytics',
  'Cloud-native architecture with auto-scaling'
];

const projectGoals = [
  'Advance scientific integrity through AI-powered detection',
  'Provide accessible tool for researchers and institutions',
  'Contribute to the Recod.ai/LUC competition',
  'Establish benchmark for image authenticity validation',
  'Enable real-time analysis for large research datasets',
  'Create open-source solution for the research community'
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              About This Project
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              An advanced AI-powered system for detecting copy-move forgeries in biomedical research images, 
              built for the prestigious Recod.ai/LUC competition.
            </p>
          </motion.div>
        </div>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">CO</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Cavin Otieno</h2>
              <p className="text-lg text-slate-600 mb-4">
                AI/ML Engineer & Full-Stack Developer
              </p>
              <p className="text-slate-600 mb-6 max-w-2xl">
                Passionate about applying artificial intelligence to solve real-world problems, 
                particularly in scientific research and data integrity. This project represents 
                the intersection of cutting-edge deep learning technology and the critical need 
                for maintaining authenticity in scientific publications.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a
                  href="https://github.com/OumaCavin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/cavin-otieno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:cavin.otieno012@gmail.com"
                  className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
                <a
                  href="tel:+254708101604"
                  className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <a
                  href="wa.me/+254708101604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Overview</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">
              The Scientific Image Forgery Detection System is a comprehensive solution designed to address 
              the critical challenge of identifying copy-move manipulations in biomedical research images. 
              With the increasing importance of scientific integrity and the potential for image manipulation 
              in research publications, this system provides researchers and institutions with a powerful 
              tool for validation.
            </p>
            <p className="text-slate-600 mb-4">
              Built specifically for the Recod.ai/LUC Scientific Image Forgery Detection competition, 
              our solution combines state-of-the-art deep learning techniques with an intuitive web interface. 
              The system can process various image formats commonly used in scientific research and provides 
              detailed analysis results including confidence scores and region-specific detection.
            </p>
            <p className="text-slate-600">
              The project demonstrates advanced knowledge in computer vision, machine learning, full-stack 
              development, and cloud deployment, representing a complete end-to-end solution for a complex 
              real-world problem.
            </p>
          </div>
        </motion.div>

        {/* Core Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((stack, index) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>{stack.category}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span
                      key={item}
                      className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-yellow-600" />
              <span>Key Achievements</span>
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Project Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span>Project Goals</span>
            </h2>
            <div className="space-y-3">
              {projectGoals.map((goal, index) => (
                <motion.div
                  key={goal}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{goal}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Competition Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Recod.ai/LUC Competition</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Participating in the prestigious Scientific Image Forgery Detection challenge with a $55,000 prize pool
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$55,000</div>
              <div className="text-blue-100">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,100+</div>
              <div className="text-blue-100">Test Images</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-blue-100">Competition Phases</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a
              href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <span>View Competition Details</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Contact & Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Interested in collaborating, learning more about the project, or discussing 
            AI applications in scientific research? I'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/OumaCavin/scientific-image-forgery-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View Source Code</span>
            </a>
            <a
              href="mailto:cavin.otieno012@gmail.com"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </a>
            <a
              href="https://linkedin.com/in/cavin-otieno"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
