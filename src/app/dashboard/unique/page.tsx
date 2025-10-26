'use client';

import { useState } from 'react';
import { ArrowLeft, Zap, Brain, Shield, Target, Eye, BookOpen, RefreshCw, TestTube, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface UniqueFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  apiEndpoint: string;
  category: 'emotional' | 'bias' | 'predictive' | 'transparent' | 'multi-doc' | 'adaptive';
  color: string;
  whatOthersCantDo: string;
}

export default function UniqueFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<UniqueFeature | null>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const features: UniqueFeature[] = [
    {
      id: 'emotional',
      title: 'Emotional Intelligence',
      description: 'Analyze emotional dynamics and interpersonal factors in legal negotiations and disputes.',
      icon: <Brain className="w-8 h-8" />,
      apiEndpoint: '/api/emotional-legal',
      category: 'emotional',
      color: 'blue',
      whatOthersCantDo: 'Existing platforms ignore emotional intelligence in legal matters'
    },
    {
      id: 'bias',
      title: 'Bias Detection',
      description: 'Detect and mitigate AI bias in legal decisions and recommendations.',
      apiEndpoint: '/api/bias-detection',
      category: 'bias',
      color: 'purple',
      icon: <Shield className="w-8 h-8" />,
      whatOthersCantDo: 'Most AI legal tools perpetuate bias without detection'
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      description: 'Predict case outcomes and legal trends using advanced analytics.',
      icon: <Target className="w-8 h-8" />,
      apiEndpoint: '/api/predictive-legal',
      category: 'predictive',
      color: 'green',
      whatOthersCantDo: 'Traditional platforms only provide historical research'
    },
    {
      id: 'transparent',
      title: 'Transparent AI',
      description: 'Provide explainable AI decisions with clear reasoning chains.',
      icon: <Eye className="w-8 h-8" />,
      apiEndpoint: '/api/explainable-ai',
      category: 'transparent',
      color: 'indigo',
      whatOthersCantDo: 'Most AI legal tools are black boxes without explanation'
    },
    {
      id: 'multi-doc',
      title: 'Multi-Document Analysis',
      description: 'Analyze multiple interconnected legal documents simultaneously.',
      icon: <BookOpen className="w-8 h-8" />,
      apiEndpoint: '/api/multi-document',
      category: 'multi-doc',
      color: 'orange',
      whatOthersCantDo: 'Existing tools analyze documents in isolation'
    },
    {
      id: 'adaptive',
      title: 'Adaptive Learning',
      description: 'Learn and adapt to unprecedented legal situations.',
      icon: <RefreshCw className="w-8 h-8" />,
      apiEndpoint: '/api/adaptive-learning',
      category: 'adaptive',
      color: 'red',
      whatOthersCantDo: 'Current AI fails on novel legal scenarios not in training data'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:text-blue-300",
      purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:text-purple-300",
      green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30 group-hover:text-green-300",
      indigo: "text-indigo-400 bg-indigo-500/20 group-hover:bg-indigo-500/30 group-hover:text-indigo-300",
      orange: "text-orange-400 bg-orange-500/20 group-hover:bg-orange-500/30 group-hover:text-orange-300",
      red: "text-red-400 bg-red-500/20 group-hover:bg-red-500/30 group-hover:text-red-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleFeatureSelect = (feature: UniqueFeature) => {
    setSelectedFeature(feature);
  };

  const handleBackToFeatures = () => {
    setSelectedFeature(null);
    setTestResult('');
  };

  const testFeature = async () => {
    if (!selectedFeature) return;
    
    setIsLoading(true);
    setTestResult('');
    
    try {
      const testData = {
        emotional: { legalScenario: "Employment contract dispute with emotional factors", context: "High-stress negotiation" },
        bias: { legalContent: "Analysis of hiring practices", analysisType: "employment" },
        predictive: { caseDetails: "Employment discrimination case", jurisdiction: "Federal", caseType: "civil" },
        transparent: { legalQuery: "What are the legal requirements for data privacy?", analysisType: "compliance" },
        'multi-doc': { documents: ["Contract A", "Contract B"], analysisFocus: "conflicts" },
        adaptive: { legalScenario: "Novel AI-related legal issue", context: "No existing precedent", existingKnowledge: "General contract law" }
      };

      const response = await fetch(selectedFeature.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData[selectedFeature.category as keyof typeof testData])
      });

      const data = await response.json();
      setTestResult(data.analysis || data.message || data.response || 'Test completed successfully');
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedFeature) {
    return (
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>

        {/* Back Button */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={handleBackToFeatures}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Unique Features</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-white">{selectedFeature.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(selectedFeature.color)}`}>
                {selectedFeature.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedFeature.title}</h2>
                <p className="text-gray-300">{selectedFeature.description}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">What Others Can't Do:</h3>
              <p className="text-gray-300 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                {selectedFeature.whatOthersCantDo}
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={testFeature}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test This Feature'}
              </button>

              {testResult && (
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Test Result:</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {testResult}
                  </pre>
                </div>
              )}

              <button
                onClick={() => setTestResult('')}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-700 transition-all duration-300"
              >
                Clear Result
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Unique Features</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Revolutionary Legal AI
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Capabilities
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Experience the future of legal research with our 6 unique AI capabilities that go beyond traditional legal tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              onClick={() => handleFeatureSelect(feature)}
              className="group cursor-pointer p-8 border border-gray-700 rounded-xl hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                <TestTube className="w-4 h-4" />
                <span>Click to test</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-white">Ready to Experience These Capabilities?</h3>
            <p className="text-gray-300 max-w-2xl">
              All these unique features are automatically integrated into every legal research query.
            </p>
            <Link 
              href="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              Start Legal Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}