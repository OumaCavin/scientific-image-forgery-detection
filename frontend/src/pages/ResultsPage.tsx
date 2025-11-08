import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileImage, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface AnalysisRecord {
  case_id: string;
  result: 'authentic' | 'forged';
  confidence: number;
  regions_count: number;
  filename: string;
  timestamp: string;
}

const mockData: AnalysisRecord[] = [
  {
    case_id: 'img_001',
    result: 'authentic',
    confidence: 0.95,
    regions_count: 0,
    filename: 'cell_microscopy_001.jpg',
    timestamp: '2025-01-09T10:30:00Z'
  },
  {
    case_id: 'img_002',
    result: 'forged',
    confidence: 0.87,
    regions_count: 2,
    filename: 'tissue_sample_002.tiff',
    timestamp: '2025-01-09T10:25:00Z'
  },
  {
    case_id: 'img_003',
    result: 'authentic',
    confidence: 0.92,
    regions_count: 0,
    filename: 'dna_sequencing_003.png',
    timestamp: '2025-01-09T10:20:00Z'
  },
  {
    case_id: 'img_004',
    result: 'forged',
    confidence: 0.78,
    regions_count: 1,
    filename: 'protein_crystal_004.jpg',
    timestamp: '2025-01-09T10:15:00Z'
  },
  {
    case_id: 'img_005',
    result: 'authentic',
    confidence: 0.96,
    regions_count: 0,
    filename: 'molecular_structure_005.bmp',
    timestamp: '2025-01-09T10:10:00Z'
  }
];

export const ResultsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'authentic' | 'forged'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence' | 'result'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);

  // Filter and sort data
  const filteredData = mockData
    .filter(item => {
      const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.case_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterResult === 'all' || item.result === filterResult;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'result':
          aValue = a.result;
          bValue = b.result;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const downloadResults = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forgery-analysis-results-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredData.length,
    authentic: filteredData.filter(item => item.result === 'authentic').length,
    forged: filteredData.filter(item => item.result === 'forged').length,
    avgConfidence: filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.confidence, 0) / filteredData.length 
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Analysis Results
          </h1>
          <p className="text-lg text-slate-600">
            View and manage your image forgery detection results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileImage className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-600">Total Results</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats.authentic}</div>
                <div className="text-sm text-slate-600">Authentic</div>
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
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.forged}</div>
                <div className="text-sm text-slate-600">Forged</div>
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {(stats.avgConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">Avg Confidence</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by filename or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <select
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value as any)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Results</option>
                  <option value="authentic">Authentic</option>
                  <option value="forged">Forged</option>
                </select>
              </div>

              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('_');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="timestamp_desc">Newest First</option>
                <option value="timestamp_asc">Oldest First</option>
                <option value="confidence_desc">High Confidence</option>
                <option value="confidence_asc">Low Confidence</option>
                <option value="result_asc">Authentic First</option>
                <option value="result_desc">Forged First</option>
              </select>

              <button
                onClick={downloadResults}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">File</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Case ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Result</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Confidence</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Regions</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Timestamp</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((record, index) => (
                  <motion.tr
                    key={record.case_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <FileImage className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-900">{record.filename}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {record.case_id}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                        record.result === 'forged' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {record.result === 'forged' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>{record.result.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              record.confidence > 0.8 ? 'bg-green-500' : 
                              record.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${record.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">
                          {(record.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">
                        {record.regions_count}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <FileImage className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600">
                {searchTerm || filterResult !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No analysis results available yet.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Analysis Details</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Filename</label>
                    <p className="text-slate-900">{selectedRecord.filename}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Case ID</label>
                    <p className="text-slate-900 font-mono">{selectedRecord.case_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Result</label>
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      selectedRecord.result === 'forged' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedRecord.result === 'forged' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{selectedRecord.result.toUpperCase()}</span>
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Confidence</label>
                    <p className="text-slate-900">{(selectedRecord.confidence * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Regions Found</label>
                    <p className="text-slate-900">{selectedRecord.regions_count}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Analysis Time</label>
                    <p className="text-slate-900">{new Date(selectedRecord.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
