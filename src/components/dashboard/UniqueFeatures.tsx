'use client';

import { useState } from 'react';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Eye, 
  FileText, 
  Lightbulb,
  Zap,
  Target,
  Users,
  BarChart3,
  Play,
  Loader2
} from 'lucide-react';

interface UniqueFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  apiEndpoint: string;
  category: 'emotional' | 'bias' | 'predictive' | 'transparent' | 'multi-doc' | 'adaptive';
  color: string;
  whatOthersCantDo: string;
  testData: any;
}

interface TestResult {
  loading: boolean;
  response: string | null;
  error: string | null;
}

const UNIQUE_FEATURES: UniqueFeature[] = [
  {
    id: 'emotional-legal',
    title: 'Emotional & Interpersonal Legal Analysis',
    description: 'Analyze emotional dynamics and interpersonal factors in legal negotiations',
    icon: <Users className="w-6 h-6" />,
    apiEndpoint: '/api/emotional-legal',
    category: 'emotional',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    whatOthersCantDo: 'Existing platforms ignore emotional intelligence in legal matters',
    testData: {
      legalScenario: 'Employment contract dispute with hostile work environment',
      context: 'Employee feels targeted and isolated by management'
    }
  },
  {
    id: 'bias-detection',
    title: 'AI Bias Detection & Mitigation',
    description: 'Detect and mitigate AI bias in legal decisions and recommendations',
    icon: <Shield className="w-6 h-6" />,
    apiEndpoint: '/api/bias-detection',
    category: 'bias',
    color: 'bg-red-50 text-red-700 border-red-200',
    whatOthersCantDo: 'Most AI legal tools perpetuate bias without detection',
    testData: {
      legalContent: 'Sentencing recommendation for criminal case involving minority defendant',
      analysisType: 'comprehensive'
    }
  },
  {
    id: 'predictive-outcomes',
    title: 'Predictive Legal Outcomes',
    description: 'Predict case outcomes and legal trends using advanced analytics',
    icon: <TrendingUp className="w-6 h-6" />,
    apiEndpoint: '/api/predictive-legal',
    category: 'predictive',
    color: 'bg-green-50 text-green-700 border-green-200',
    whatOthersCantDo: 'Traditional platforms only provide historical research',
    testData: {
      caseDetails: 'Employment discrimination case with strong evidence',
      jurisdiction: 'federal',
      caseType: 'civil rights'
    }
  },
  {
    id: 'transparent-reasoning',
    title: 'Transparent AI Reasoning',
    description: 'Provide explainable AI decisions with clear reasoning chains',
    icon: <Eye className="w-6 h-6" />,
    apiEndpoint: '/api/explainable-ai',
    category: 'transparent',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    whatOthersCantDo: 'Most AI legal tools are black boxes without explanation',
    testData: {
      legalQuery: 'What are the legal requirements for data privacy compliance?',
      analysisType: 'comprehensive'
    }
  },
  {
    id: 'multi-document',
    title: 'Multi-Document Cross-Analysis',
    description: 'Analyze multiple interconnected legal documents simultaneously',
    icon: <FileText className="w-6 h-6" />,
    apiEndpoint: '/api/multi-document',
    category: 'multi-doc',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    whatOthersCantDo: 'Existing tools analyze documents in isolation',
    testData: {
      documents: ['Contract A', 'Contract B', 'Legal Precedent C'],
      analysisType: 'cross-reference'
    }
  },
  {
    id: 'adaptive-learning',
    title: 'Adaptive Learning for Novel Scenarios',
    description: 'Learn and adapt to unprecedented legal situations',
    icon: <Brain className="w-6 h-6" />,
    apiEndpoint: '/api/adaptive-learning',
    category: 'adaptive',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    whatOthersCantDo: 'Current AI fails on novel legal scenarios not in training data',
    testData: {
      legalScenario: 'Novel AI regulation compliance case',
      context: 'First-of-its-kind legal challenge'
    }
  }
];

interface Props {
  onFeatureSelect: (feature: UniqueFeature) => void;
}

export default function UniqueFeatures({ onFeatureSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const categories = [
    { id: 'all', label: 'All Features', count: UNIQUE_FEATURES.length },
    { id: 'emotional', label: 'Emotional Intelligence', count: UNIQUE_FEATURES.filter(f => f.category === 'emotional').length },
    { id: 'bias', label: 'Bias Detection', count: UNIQUE_FEATURES.filter(f => f.category === 'bias').length },
    { id: 'predictive', label: 'Predictive Analytics', count: UNIQUE_FEATURES.filter(f => f.category === 'predictive').length },
    { id: 'transparent', label: 'Transparent AI', count: UNIQUE_FEATURES.filter(f => f.category === 'transparent').length },
    { id: 'multi-doc', label: 'Multi-Document', count: UNIQUE_FEATURES.filter(f => f.category === 'multi-doc').length },
    { id: 'adaptive', label: 'Adaptive Learning', count: UNIQUE_FEATURES.filter(f => f.category === 'adaptive').length },
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? UNIQUE_FEATURES 
    : UNIQUE_FEATURES.filter(f => f.category === selectedCategory);

  const testFeature = async (feature: UniqueFeature) => {
    setTestResults(prev => ({
      ...prev,
      [feature.id]: { loading: true, response: null, error: null }
    }));

    try {
      console.log(`Testing ${feature.title} with data:`, feature.testData);
      
      const response = await fetch(feature.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature.testData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response from ${feature.title}:`, data);
      
      setTestResults(prev => ({
        ...prev,
        [feature.id]: { 
          loading: false, 
          response: data.analysis || data.message || data.response || 'Success!', 
          error: null 
        }
      }));
    } catch (error) {
      console.error(`Error testing ${feature.title}:`, error);
      setTestResults(prev => ({
        ...prev,
        [feature.id]: { 
          loading: false, 
          response: null, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900">Unique AI Legal Capabilities</h2>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          const testResult = testResults[feature.id];
          return (
            <div
              key={feature.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800">What Others Can't Do:</p>
                        <p className="text-xs text-yellow-700">{feature.whatOthersCantDo}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Test Results */}
                  {testResult && (
                    <div className="mb-3">
                      {testResult.loading && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Testing feature...</span>
                        </div>
                      )}
                      {testResult.response && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-green-800 mb-2">AI Response:</p>
                          <div className="text-xs text-green-700 max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans">{testResult.response}</pre>
                          </div>
                        </div>
                      )}
                      {testResult.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-800 mb-1">Error:</p>
                          <p className="text-xs text-red-700">{testResult.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${feature.color}`}>
                      {feature.category}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          testFeature(feature);
                        }}
                        disabled={testResult?.loading}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        <span>{testResult?.loading ? 'Testing...' : 'Test'}</span>
                      </button>
                      {testResult && (testResult.response || testResult.error) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestResults(prev => ({
                              ...prev,
                              [feature.id]: { loading: false, response: null, error: null }
                            }));
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => onFeatureSelect(feature)}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No features found for the selected category.</p>
        </div>
      )}

      {/* Competitive Advantage Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Competitive Advantage</h3>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            While existing AI legal platforms focus on basic research and document review, 
            LegalAI addresses the fundamental limitations that prevent AI from truly transforming legal practice. 
            Our unique capabilities make AI not just a tool, but a strategic partner in legal decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}
