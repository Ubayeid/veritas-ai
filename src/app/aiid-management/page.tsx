'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { uploadAIIDFromFile, getAIIDTemplate, downloadAIIDData } from '@/lib/ai-safety/upload-aiid';

interface SafetyStats {
  totalIncidents: number;
  incidentsByCategory: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  patternsGenerated: number;
}

interface AIIDIncident {
  id: string;
  title: string;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other';
  keywords: string[];
  mitigation: string[];
  affected_domains: string[];
  legal_implications?: string[];
}

export default function AIIDManagementPage() {
  const [stats, setStats] = useState<SafetyStats | null>(null);
  const [incidents, setIncidents] = useState<AIIDIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load initial data
  useEffect(() => {
    loadSafetyStats();
    loadRecentIncidents();
  }, []);

  const loadSafetyStats = async () => {
    try {
      const response = await fetch('/api/ai-safety?action=get_safety_stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load safety stats:', error);
    }
  };

  const loadRecentIncidents = async () => {
    try {
      const response = await fetch('/api/ai-safety?action=get_recent_incidents&limit=10');
      const data = await response.json();
      if (data.success) {
        setIncidents(data.incidents);
      }
    } catch (error) {
      console.error('Failed to load incidents:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setUploadResult(null);

    try {
      const result = await uploadAIIDFromFile(selectedFile);
      setUploadResult(result.message);
      
      if (result.success) {
        // Reload data after successful upload
        await loadSafetyStats();
        await loadRecentIncidents();
      }
    } catch (error) {
      setUploadResult(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = getAIIDTemplate();
    downloadAIIDData([template], 'aiid-template.json');
  };

  const downloadCurrentData = () => {
    downloadAIIDData(incidents, 'aiid-current-data.json');
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      bias: 'bg-purple-100 text-purple-800',
      privacy: 'bg-blue-100 text-blue-800',
      security: 'bg-red-100 text-red-800',
      misinformation: 'bg-orange-100 text-orange-800',
      safety: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                href="/dashboard/unique" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Unique Features
              </Link>
              <Link 
                href="/trust-safety" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Trust & Safety
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Database className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AIID Data Management</h1>
          </div>
          <p className="text-gray-600">
            Manage AIID (Artificial Intelligence Incident Database) data to enhance AI safety and prevent known incidents.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload AIID Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select AIID Data File (JSON or CSV)
              </label>
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Uploading...' : 'Upload Data'}
              </button>

              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>

            {uploadResult && (
              <div className={`p-3 rounded-md ${
                uploadResult.includes('Successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {uploadResult}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Database className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIncidents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Safety Patterns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.patternsGenerated}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.incidentsByCategory).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.incidentsBySeverity.critical || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent AIID Incidents</h2>
            <div className="flex space-x-2">
              <button
                onClick={loadRecentIncidents}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={downloadCurrentData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No AIID incidents loaded. Upload data to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(incident.category)}`}>
                        {incident.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{incident.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {incident.keywords.slice(0, 5).map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {keyword}
                      </span>
                    ))}
                    {incident.keywords.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{incident.keywords.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(incident.date).toLocaleDateString()} • {incident.affected_domains.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
