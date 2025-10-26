'use client';

import { useState } from 'react';

export default function TestUniqueFeatures() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      let fullResponse = '';
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'text') {
                fullResponse += data.content;
                setResponse(fullResponse);
              } else if (data.type === 'warning') {
                fullResponse += `\n\n⚠️ ${data.content}`;
                setResponse(fullResponse);
              } else if (data.type === 'info') {
                fullResponse += `\n\nℹ️ ${data.content}`;
                setResponse(fullResponse);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCases = [
    {
      name: 'Emotional Intelligence Test',
      query: 'How should I handle a difficult client negotiation in a contract dispute?'
    },
    {
      name: 'Bias Detection Test', 
      query: 'What are the legal requirements for hiring employees?'
    },
    {
      name: 'Predictive Analytics Test',
      query: 'What is the likely outcome of this employment discrimination case?'
    },
    {
      name: 'Multi-Document Test',
      query: 'Analyze the relationship between these three contracts and identify conflicts'
    },
    {
      name: 'Adaptive Learning Test',
      query: 'How should I handle this novel AI-related legal issue that has no precedent?'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Unique Features Integration Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Legal Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-32"
                placeholder="Enter a legal query to test unique features integration..."
              />
            </div>
            
            <button
              onClick={testQuery}
              disabled={loading || !query.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
            >
              {loading ? 'Analyzing...' : 'Test Unique Features Integration'}
            </button>

            {/* Test Cases */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Test Cases</h3>
              <div className="space-y-2">
                {testCases.map((testCase, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(testCase.query)}
                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
                  >
                    <div className="text-white font-medium">{testCase.name}</div>
                    <div className="text-gray-400 text-sm mt-1">{testCase.query}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">AI Response with Unique Features</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-300">Analyzing with unique AI capabilities...</span>
                </div>
              ) : response ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {response}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  Enter a query to see how unique AI capabilities are integrated into the response
                </div>
              )}
            </div>

            {/* Expected Features */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Expected Unique Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Explicit mention of which capabilities are applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Natural integration throughout the response</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Explanation of value each capability provides</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">AIID safety validation and warnings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
