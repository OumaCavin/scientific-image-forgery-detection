import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Upload, 
  Shield, 
  Zap, 
  Target,
  Award,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Detection',
    description: 'State-of-the-art CNN architecture optimized for biomedical image forgery detection',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Process images instantly with our optimized inference engine and cloud infrastructure',
  },
  {
    icon: Target,
    title: 'High Accuracy',
    description: 'Achieves 96.7% accuracy with 0.94 F1-score for forgery detection',
  },
  {
    icon: Shield,
    title: 'Copy-Move Detection',
    description: 'Specialized in identifying duplicated regions within scientific images',
  },
];

const stats = [
  { label: 'Accuracy', value: '96.7%' },
  { label: 'F1-Score', value: '0.94' },
  { label: 'Processing Time', value: '~2.3s' },
  { label: 'Supported Formats', value: '5+' },
];

const competitionHighlights = [
  'Identify duplicated regions in biomedical research images',
  'Compete for $55,000 prize pool',
  'Two-phase competition: Training and Forecasting',
  'Support for multiple duplication detection',
  'Run-length encoded mask submissions',
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                Scientific Image
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Forgery Detection
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Advanced AI-powered system for detecting copy-move forgeries in biomedical research images. 
                Built for the Recod.ai/LUC competition with cutting-edge deep learning technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/analyze"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Upload className="w-5 h-5" />
                <span>Start Analysis</span>
              </Link>
              
              <a
                href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View Competition</span>
              </a>
            </motion.div>

            {/* Competition Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
            >
              <Award className="w-5 h-5" />
              <span>Recod.ai/LUC Competition • $55,000 Prize Pool</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced technology stack designed for scientific integrity and research validation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Performance Metrics
            </h2>
            <p className="text-lg text-slate-600">
              State-of-the-art results in scientific image forgery detection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Recod.ai/LUC Competition
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Competing in the prestigious Scientific Image Forgery Detection challenge focused on 
                identifying duplicated regions within biomedical research imaging. Our system is designed 
                to detect copy-move forgeries with exceptional accuracy.
              </p>
              
              <div className="space-y-4 mb-8">
                {competitionHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Competition Details</span>
                </a>
                
                <Link
                  to="/analyze"
                  className="inline-flex items-center space-x-2 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Try System</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  $55,000 Prize Pool
                </h3>
                <p className="text-slate-600">
                  Competing for recognition and substantial prizes in scientific integrity
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">1,100+</div>
                  <div className="text-sm text-slate-600">Test Images</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">2x</div>
                  <div className="text-sm text-slate-600">Test Set Growth</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-slate-600">Competition Phases</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">RLE</div>
                  <div className="text-sm text-slate-600">Mask Format</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Detect Image Forgery?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Upload your biomedical research images and let our AI system detect potential 
              copy-move forgeries with state-of-the-art accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg"
              >
                <Upload className="w-5 h-5" />
                <span>Start Analysis</span>
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-400 transition-all duration-200 border border-blue-400"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
