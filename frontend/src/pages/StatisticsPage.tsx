import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Cpu, 
  HardDrive,
  Database,
  Globe,
  Award,
  CheckCircle
} from 'lucide-react';

interface StatisticsData {
  totalAnalyses: number;
  authenticCount: number;
  forgedCount: number;
  avgConfidence: number;
  avgProcessingTime: number;
  successRate: number;
  modelInfo: {
    version: string;
    device: string;
    confidenceThreshold: number;
    imageSize: number;
  };
  competition: {
    name: string;
    url: string;
    prizePool: string;
  };
}

const mockStatistics: StatisticsData = {
  totalAnalyses: 1247,
  authenticCount: 892,
  forgedCount: 355,
  avgConfidence: 0.87,
  avgProcessingTime: 2.3,
  successRate: 99.8,
  modelInfo: {
    version: "1.0.0",
    device: "CUDA GPU",
    confidenceThreshold: 0.5,
    imageSize: 512
  },
  competition: {
    name: "Recod.ai/LUC - Scientific Image Forgery Detection",
    url: "https://www.kaggle.com/competitions/recodai-luc-scientific-image-forgery-detection",
    prizePool: "$55,000"
  }
};

const dailyAnalyses = [
  { date: '2025-01-01', authentic: 45, forged: 12 },
  { date: '2025-01-02', authentic: 52, forged: 18 },
  { date: '2025-01-03', authentic: 48, forged: 15 },
  { date: '2025-01-04', authentic: 63, forged: 22 },
  { date: '2025-01-05', authentic: 58, forged: 19 },
  { date: '2025-01-06', authentic: 71, forged: 28 },
  { date: '2025-01-07', authentic: 67, forged: 25 },
  { date: '2025-01-08', authentic: 74, forged: 31 },
  { date: '2025-01-09', authentic: 69, forged: 27 }
];

const confidenceDistribution = [
  { range: '0.9-1.0', count: 456, color: '#10B981' },
  { range: '0.8-0.9', count: 324, color: '#3B82F6' },
  { range: '0.7-0.8', count: 198, color: '#F59E0B' },
  { range: '0.6-0.7', count: 142, color: '#EF4444' },
  { range: '0.5-0.6', count: 87, color: '#8B5CF6' }
];

const processingTimes = [
  { time: '1.0s', count: 234, color: '#10B981' },
  { time: '1.5s', count: 387, color: '#3B82F6' },
  { time: '2.0s', count: 298, color: '#F59E0B' },
  { time: '2.5s', count: 189, color: '#EF4444' },
  { time: '3.0s+', count: 89, color: '#8B5CF6' }
];

const fileTypes = [
  { name: 'JPEG', value: 45, color: '#3B82F6' },
  { name: 'PNG', value: 28, color: '#10B981' },
  { name: 'TIFF', value: 18, color: '#F59E0B' },
  { name: 'BMP', value: 9, color: '#EF4444' }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const StatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStatistics(mockStatistics);
    }, 500);
  }, [timeRange]);

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            System Statistics
          </h1>
          <p className="text-lg text-slate-600">
            Performance metrics and analysis insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {statistics.totalAnalyses.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Analyses</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {(statistics.avgConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">Avg Confidence</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {statistics.avgProcessingTime}s
                </div>
                <div className="text-sm text-slate-600">Avg Processing</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {statistics.successRate}%
                </div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Daily Analysis Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Daily Analysis Trends</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyAnalyses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="authentic" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Authentic"
                />
                <Line 
                  type="monotone" 
                  dataKey="forged" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Forged"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analysis Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Confidence Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Confidence Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Processing Time Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Processing Time Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processingTimes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {processingTimes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* File Types and Competition Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Type Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">File Type Distribution</h3>
            <div className="space-y-4">
              {fileTypes.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.value}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competition Information */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Competition Info</h3>
                <p className="text-sm text-slate-600">Recod.ai/LUC Challenge</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Prize Pool</span>
                <span className="font-semibold text-blue-600">{statistics.competition.prizePool}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Objective</span>
                <span className="text-sm text-slate-600">Copy-move detection</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Focus</span>
                <span className="text-sm text-slate-600">Biomedical imaging</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Format</span>
                <span className="text-sm text-slate-600">Run-length encoding</span>
              </div>
            </div>
            
            <a
              href={statistics.competition.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span>View Competition</span>
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">System Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Cpu className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-slate-900">
                {statistics.modelInfo.device}
              </div>
              <div className="text-sm text-slate-600">Processing Device</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <HardDrive className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-slate-900">
                {statistics.modelInfo.image_size}px
              </div>
              <div className="text-sm text-slate-600">Image Resolution</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-slate-900">
                {statistics.modelInfo.confidenceThreshold}
              </div>
              <div className="text-sm text-slate-600">Confidence Threshold</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-slate-900">
                v{statistics.modelInfo.version}
              </div>
              <div className="text-sm text-slate-600">Model Version</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
