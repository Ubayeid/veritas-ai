/**
 * AIID Data Upload Utility
 * Helper functions for uploading and processing AIID data
 */

import { AIIDIncident } from './aiid-processor';

export interface UploadResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
}

/**
 * Upload AIID data from file
 */
export async function uploadAIIDFromFile(file: File): Promise<UploadResult> {
  try {
    const text = await file.text();
    let incidents: AIIDIncident[] = [];

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      incidents = Array.isArray(data) ? data : data.incidents || [];
    } catch (jsonError) {
      // Try to parse as CSV
      try {
        incidents = parseCSVToAIID(text);
      } catch (csvError) {
        return {
          success: false,
          message: 'Failed to parse file. Supported formats: JSON, CSV',
          errors: [jsonError instanceof Error ? jsonError.message : 'JSON parse error']
        };
      }
    }

    // Validate incidents
    const validationResult = validateAIIDData(incidents);
    if (!validationResult.valid) {
      return {
        success: false,
        message: 'Invalid AIID data format',
        errors: validationResult.errors
      };
    }

    // Upload to API
    const response = await fetch('/api/ai-safety', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'load_aiid_data',
        incidents: incidents
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: `Successfully uploaded ${incidents.length} AIID incidents`,
        count: incidents.length
      };
    } else {
      return {
        success: false,
        message: 'Failed to upload AIID data',
        errors: [result.error || 'Unknown error']
      };
    }

  } catch (error) {
    return {
      success: false,
      message: 'Upload failed',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Parse CSV data to AIID format
 */
function parseCSVToAIID(csvText: string): AIIDIncident[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const incidents: AIIDIncident[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const incident: any = {};
    headers.forEach((header, index) => {
      incident[header] = values[index];
    });

    // Map to AIID format
    incidents.push({
      id: incident.id || incident.incident_id || `csv_${i}`,
      title: incident.title || incident.name || 'Untitled',
      description: incident.description || incident.summary || '',
      date: incident.date || incident.created_at || new Date().toISOString(),
      severity: mapSeverity(incident.severity || incident.risk_level || 'medium'),
      category: mapCategory(incident.category || incident.type || 'other'),
      keywords: (incident.keywords || '').split(';').filter(k => k.trim()),
      mitigation: (incident.mitigation || incident.recommendations || '').split(';').filter(m => m.trim()),
      affected_domains: (incident.affected_domains || incident.domains || '').split(';').filter(d => d.trim()),
      legal_implications: (incident.legal_implications || incident.legal_issues || '').split(';').filter(l => l.trim())
    });
  }

  return incidents;
}

/**
 * Map severity string to enum
 */
function mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    '1': 'low', '2': 'medium', '3': 'high', '4': 'critical',
    'low': 'low', 'medium': 'medium', 'high': 'high', 'critical': 'critical',
    'severe': 'critical', 'minor': 'low'
  };
  return severityMap[severity.toLowerCase()] || 'medium';
}

/**
 * Map category string to enum
 */
function mapCategory(category: string): 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other' {
  const categoryMap: Record<string, 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other'> = {
    'bias': 'bias', 'discrimination': 'bias', 'fairness': 'bias',
    'privacy': 'privacy', 'data_protection': 'privacy',
    'security': 'security', 'vulnerability': 'security',
    'misinformation': 'misinformation', 'disinformation': 'misinformation',
    'safety': 'safety', 'harm': 'safety'
  };
  return categoryMap[category.toLowerCase()] || 'other';
}

/**
 * Validate AIID data format
 */
function validateAIIDData(incidents: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(incidents)) {
    errors.push('Data must be an array of incidents');
    return { valid: false, errors };
  }

  incidents.forEach((incident, index) => {
    if (!incident.id) {
      errors.push(`Incident ${index + 1}: Missing required field 'id'`);
    }
    if (!incident.title) {
      errors.push(`Incident ${index + 1}: Missing required field 'title'`);
    }
    if (!incident.description) {
      errors.push(`Incident ${index + 1}: Missing required field 'description'`);
    }
    if (!incident.date) {
      errors.push(`Incident ${index + 1}: Missing required field 'date'`);
    }
    if (!incident.severity) {
      errors.push(`Incident ${index + 1}: Missing required field 'severity'`);
    }
    if (!incident.category) {
      errors.push(`Incident ${index + 1}: Missing required field 'category'`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Get AIID data template for reference
 */
export function getAIIDTemplate(): AIIDIncident {
  return {
    id: 'example_incident_001',
    title: 'Example AI Bias Incident',
    description: 'This is an example AIID incident showing the required format',
    date: '2024-01-15T10:30:00Z',
    severity: 'medium',
    category: 'bias',
    keywords: ['bias', 'discrimination', 'fairness', 'algorithm'],
    mitigation: [
      'Implement bias detection algorithms',
      'Regular fairness audits',
      'Diverse training data review'
    ],
    affected_domains: ['legal', 'employment', 'criminal_justice'],
    legal_implications: [
      'Potential discrimination claims',
      'Regulatory compliance issues',
      'Ethical AI requirements'
    ]
  };
}

/**
 * Download AIID data as JSON
 */
export function downloadAIIDData(data: AIIDIncident[], filename: string = 'aiid-data.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
