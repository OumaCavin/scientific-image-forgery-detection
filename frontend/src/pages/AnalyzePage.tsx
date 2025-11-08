import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Eye,
  Zap
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../utils/apiClient';

interface AnalysisResult {
  case_id: string;
  result: 'authentic' | 'forged';
  confidence: number;
  regions: Array<{
    coordinates: number[][];
    confidence: number;
    area: number;
  }>;
  mask: string;
  filename: string;
  timestamp: string;
}

interface BatchResult {
  batch_id: string;
  total_images: number;
  processed_images: number;
  results: AnalysisResult[];
  summary: {
    authentic: number;
    forged: number;
    avg_confidence: number;
  };
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp'];

export const AnalyzePage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'single' | 'batch'>('single');
  const [results, setResults] = useState<AnalysisResult[] | BatchResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const analyzeMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (files.length === 1) {
        // Single file analysis
        const formData = new FormData();
        formData.append('file', files[0]);
        
        const response = await apiClient.post('/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data as AnalysisResult;
      } else {
        // Batch analysis
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await apiClient.post('/batch-analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data as BatchResult;
      }
    },
    onSuccess: (data) => {
      setResults(data);
      setShowResults(true);
      const count = 'batch_id' in data ? data.processed_images : 1;
      toast.success(`Analysis complete! Processed ${count} image${count > 1 ? 's' : ''}.`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed. Please try again.');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast.error('Some files were rejected. Please check file types and size limits.');
    }
    
    const validFiles = acceptedFiles.filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Unsupported file type`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File too large (max 50MB)`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.bmp'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: analysisMode === 'batch',
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setResults(null);
    setShowResults(false);
  };

  const startAnalysis = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to analyze.');
      return;
    }
    
    analyzeMutation.mutate(selectedFiles);
  };

  const downloadResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forgery-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Image Forgery Analysis
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your biomedical research images to detect potential copy-move forgeries 
            using our advanced AI-powered detection system.
          </p>
        </div>

        {/* Analysis Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                setAnalysisMode('single');
                setSelectedFiles([]);
                setResults(null);
                setShowResults(false);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                analysisMode === 'single'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Single Image
            </button>
            <button
              onClick={() => {
                setAnalysisMode('batch');
                setSelectedFiles([]);
                setResults(null);
                setShowResults(false);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                analysisMode === 'batch'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Batch Analysis
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              
              {isDragActive ? (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Drop your images here
                  </h3>
                  <p className="text-slate-600">
                    {analysisMode === 'single' 
                      ? 'Upload a single image for analysis' 
                      : 'Drop multiple images for batch processing'
                    }
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {analysisMode === 'single' 
                      ? 'Upload Single Image' 
                      : 'Upload Multiple Images'
                    }
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {analysisMode === 'single' 
                      ? 'Drag & drop an image or click to browse' 
                      : 'Drag & drop multiple images or click to browse'
                    }
                  </p>
                  
                  <div className="text-sm text-slate-500">
                    <p>Supported formats: JPEG, PNG, TIFF, BMP</p>
                    <p>Maximum file size: 50MB</p>
                    {analysisMode === 'batch' && (
                      <p>Maximum 10 images per batch</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Selected Files ({selectedFiles.length})
              </h3>
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl"
                >
                  <FileImage className="w-8 h-8 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Button */}
        {selectedFiles.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={startAnalysis}
              disabled={analyzeMutation.isPending}
              className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>
                    {analysisMode === 'single' 
                      ? 'Analyze Image' 
                      : `Analyze ${selectedFiles.length} Images`
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Analysis Results
                </h3>
                <button
                  onClick={downloadResults}
                  className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {'batch_id' in results ? (
                // Batch Results
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {results.summary.authentic}
                      </div>
                      <div className="text-sm text-slate-600">Authentic</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        {results.summary.forged}
                      </div>
                      <div className="text-sm text-slate-600">Forged</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        {(results.summary.avg_confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600">Avg Confidence</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {results.results.map((result, index) => (
                      <ResultCard key={result.case_id} result={result} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                // Single Result
                <ResultCard result={results as AnalysisResult} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ResultCardProps {
  result: AnalysisResult;
  index?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  const statusColor = result.result === 'forged' ? 'red' : 'green';
  const StatusIcon = result.result === 'forged' ? AlertCircle : CheckCircle;

  return (
    <div className="border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            statusColor === 'red' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <StatusIcon className={`w-5 h-5 ${
              statusColor === 'red' ? 'text-red-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">
              {result.filename}
            </h4>
            <p className="text-sm text-slate-500">
              Case ID: {result.case_id}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${
            statusColor === 'red' ? 'text-red-600' : 'text-green-600'
          }`}>
            {result.result === 'forged' ? 'FORGED' : 'AUTHENTIC'}
          </div>
          <div className="text-sm text-slate-500">
            {(result.confidence * 100).toFixed(1)}% confidence
          </div>
        </div>
      </div>

      {result.regions.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-slate-600 mb-2">
            {result.regions.length} region{result.regions.length > 1 ? 's' : ''} detected
          </div>
          <div className="text-xs text-slate-500">
            Highest confidence: {Math.max(...result.regions.map(r => r.confidence * 100)).toFixed(1)}%
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Eye className="w-4 h-4" />
        <span>{showDetails ? 'Hide' : 'Show'} Details</span>
      </button>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-slate-200"
        >
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Analysis Time:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            <p><strong>Result:</strong> {result.result}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
            <p><strong>Regions Found:</strong> {result.regions.length}</p>
            {result.mask && (
              <div>
                <strong>Run-length Encoded Mask:</strong>
                <pre className="mt-1 p-2 bg-slate-50 rounded text-xs overflow-x-auto">
                  {result.mask}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
