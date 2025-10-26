'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestAIIDPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAIIDData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test loading AIID data
      const response = await fetch('/api/ai-safety', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'load_aiid_data'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to load AIID data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSafetyAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test safety analysis
      const response = await fetch('/api/ai-safety', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze_query',
          query: 'AI bias in legal sentencing algorithms'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to analyze query');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyStats = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get safety statistics
      const response = await fetch('/api/ai-safety?action=get_safety_stats');
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to get safety stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gray-900">VeritasAI</h1>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Legal Research
              </Link>
              <Link 
                href="/aiid-management" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                AIID Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AIID Integration Test</h1>
          <p className="text-gray-600">
            Test the AIID data integration and safety analysis features.
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testAIIDData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load AIID Data'}
          </button>

          <button
            onClick={testSafetyAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Test Safety Analysis'}
          </button>

          <button
            onClick={getSafetyStats}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Safety Stats'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <h3 className="text-gray-900 font-medium mb-4">Test Results</h3>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-6">
          <h3 className="text-blue-900 font-medium mb-2">Test Instructions</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• <strong>Load AIID Data:</strong> Loads and processes your AIID CSV files</li>
            <li>• <strong>Test Safety Analysis:</strong> Analyzes a sample query for safety risks</li>
            <li>• <strong>Get Safety Stats:</strong> Shows statistics about loaded AIID incidents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
