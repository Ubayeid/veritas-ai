/**
 * AIID Data Loader
 * Loads and processes AIID data from various sources
 */

import { AIIDIncident, aiidProcessor } from './aiid-processor';
import { sampleAIIDData } from './sample-aiid-data';

export interface AIIDDataSource {
  name: string;
  url?: string;
  filePath?: string;
  format: 'json' | 'csv' | 'api';
}

export class AIIDDataLoader {
  private sources: AIIDDataSource[] = [];

  constructor() {
    this.initializeDefaultSources();
  }

  /**
   * Initialize default AIID data sources
   */
  private initializeDefaultSources(): void {
    this.sources = [
      {
        name: 'AIID Incidents CSV',
        filePath: '/data/aiid/incidents.csv',
        format: 'csv'
      },
      {
        name: 'AIID Classifications CSV',
        filePath: '/data/aiid/classifications_CSETv1.csv',
        format: 'csv'
      },
      {
        name: 'AIID Reports CSV',
        filePath: '/data/aiid/reports.csv',
        format: 'csv'
      },
      {
        name: 'AIID Submissions CSV',
        filePath: '/data/aiid/submissions.csv',
        format: 'csv'
      }
    ];
  }

  /**
   * Load AIID data from all available sources
   */
  async loadAllData(): Promise<AIIDIncident[]> {
    const allIncidents: AIIDIncident[] = [];

    for (const source of this.sources) {
      try {
        const incidents = await this.loadFromSource(source);
        allIncidents.push(...incidents);
        console.log(`Loaded ${incidents.length} incidents from ${source.name}`);
      } catch (error) {
        console.warn(`Failed to load from ${source.name}:`, error);
      }
    }

    // If no incidents loaded from files, use sample data
    if (allIncidents.length === 0) {
      console.log('No incidents loaded from files, using sample data');
      allIncidents.push(...sampleAIIDData);
    }

    // Remove duplicates based on ID
    const uniqueIncidents = this.removeDuplicates(allIncidents);
    
    // Load into processor
    aiidProcessor.loadAIIDData(uniqueIncidents);
    
    return uniqueIncidents;
  }

  /**
   * Load data from a specific source
   */
  private async loadFromSource(source: AIIDDataSource): Promise<AIIDIncident[]> {
    switch (source.format) {
      case 'api':
        return await this.loadFromAPI(source.url!);
      case 'json':
        return await this.loadFromJSON(source.filePath!);
      case 'csv':
        return await this.loadFromCSV(source.filePath!);
      default:
        throw new Error(`Unsupported format: ${source.format}`);
    }
  }

  /**
   * Load data from API
   */
  private async loadFromAPI(url: string): Promise<AIIDIncident[]> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformAPIData(data);
  }

  /**
   * Load data from JSON file
   */
  private async loadFromJSON(filePath: string): Promise<AIIDIncident[]> {
    // In a real implementation, you would read from the file system
    // For now, we'll return an empty array as a placeholder
    console.log(`Loading from JSON file: ${filePath}`);
    return [];
  }

  /**
   * Load data from CSV file
   */
  private async loadFromCSV(filePath: string): Promise<AIIDIncident[]> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Convert relative path to absolute path
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      const csvText = await fs.readFile(fullPath, 'utf-8');
      const incidents = this.parseAIIDCSV(csvText, filePath);
      return incidents;
    } catch (error) {
      console.error(`Error loading CSV from ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Parse AIID CSV data
   */
  private parseAIIDCSV(csvText: string, filePath: string): AIIDIncident[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const incidents: AIIDIncident[] = [];

    // Limit to first 10 incidents for testing
    const maxIncidents = 10;
    let processedCount = 0;
    
    for (let i = 1; i < lines.length && processedCount < maxIncidents; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV line with proper handling of quoted fields
      const values = this.parseCSVLineSimple(line);
      
      if (values.length !== headers.length) {
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Transform based on file type
      if (filePath.includes('incidents.csv')) {
        const incident = this.transformIncidentRow(row);
        incidents.push(incident);
        processedCount++;
      } else if (filePath.includes('classifications')) {
        incidents.push(this.transformClassificationRow(row));
        processedCount++;
      } else if (filePath.includes('reports.csv')) {
        incidents.push(this.transformReportRow(row));
        processedCount++;
      } else if (filePath.includes('submissions.csv')) {
        incidents.push(this.transformSubmissionRow(row));
        processedCount++;
      }
    }

    return incidents;
  }

  /**
   * Parse CSV line handling quoted fields
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Simple CSV parsing for testing
   */
  private parseCSVLineSimple(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Transform incident row to AIID format
   */
  private transformIncidentRow(row: any): AIIDIncident {
    const description = row.description || '';
    const title = row.title || 'Untitled Incident';
    
    // Extract keywords from title and description
    const keywords = this.extractKeywordsFromText(`${title} ${description}`);
    
    // Determine severity based on keywords and content
    const severity = this.determineSeverity(description, title);
    
    // Determine category based on content analysis
    const category = this.determineCategory(description, title);
    
    // Extract affected parties
    const affectedParties = this.parseArrayField(row['Alleged harmed or nearly harmed parties'] || '');
    const deployers = this.parseArrayField(row['Alleged deployer of AI system'] || '');
    const developers = this.parseArrayField(row['Alleged developer of AI system'] || '');
    
    return {
      id: row.incident_id || row._id || `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      description: description,
      date: row.date || new Date().toISOString(),
      severity: severity,
      category: category,
      keywords: keywords,
      mitigation: this.generateMitigationSuggestions(category, severity),
      affected_domains: this.extractDomains(affectedParties, deployers, developers),
      legal_implications: this.extractLegalImplications(description, category)
    };
  }

  /**
   * Transform classification row to AIID format
   */
  private transformClassificationRow(row: any): AIIDIncident {
    return {
      id: `classification_${row.incident_id || Date.now()}`,
      title: `Classification: ${row.incident_id || 'Unknown'}`,
      description: row.description || 'Classification data',
      date: row.date || new Date().toISOString(),
      severity: 'medium',
      category: 'other',
      keywords: ['classification', 'categorization'],
      mitigation: ['Review classification accuracy', 'Implement quality controls'],
      affected_domains: ['classification'],
      legal_implications: []
    };
  }

  /**
   * Transform report row to AIID format
   */
  private transformReportRow(row: any): AIIDIncident {
    return {
      id: `report_${row.incident_id || Date.now()}`,
      title: `Report: ${row.incident_id || 'Unknown'}`,
      description: row.description || 'Report data',
      date: row.date || new Date().toISOString(),
      severity: 'low',
      category: 'other',
      keywords: ['report', 'documentation'],
      mitigation: ['Ensure report accuracy', 'Regular review processes'],
      affected_domains: ['reporting'],
      legal_implications: []
    };
  }

  /**
   * Transform submission row to AIID format
   */
  private transformSubmissionRow(row: any): AIIDIncident {
    return {
      id: `submission_${row.incident_id || Date.now()}`,
      title: `Submission: ${row.incident_id || 'Unknown'}`,
      description: row.description || 'Submission data',
      date: row.date || new Date().toISOString(),
      severity: 'low',
      category: 'other',
      keywords: ['submission', 'user_report'],
      mitigation: ['Review submission process', 'Validate user reports'],
      affected_domains: ['submissions'],
      legal_implications: []
    };
  }

  /**
   * Parse array field from CSV (handles JSON-like arrays)
   */
  private parseArrayField(field: string): string[] {
    if (!field || field === '[]') return [];
    
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Fallback to simple comma splitting
      return field.split(',').map(item => item.trim().replace(/[\[\]"]/g, '')).filter(item => item);
    }
  }

  /**
   * Determine severity based on content analysis
   */
  private determineSeverity(description: string, title: string): 'low' | 'medium' | 'high' | 'critical' {
    const text = `${title} ${description}`.toLowerCase();
    
    const criticalKeywords = ['killed', 'death', 'fatal', 'critical', 'severe', 'hack', 'breach', 'stolen'];
    const highKeywords = ['harm', 'injury', 'discrimination', 'bias', 'unfair', 'violation'];
    const mediumKeywords = ['error', 'mistake', 'incorrect', 'problem', 'issue'];
    
    if (criticalKeywords.some(keyword => text.includes(keyword))) return 'critical';
    if (highKeywords.some(keyword => text.includes(keyword))) return 'high';
    if (mediumKeywords.some(keyword => text.includes(keyword))) return 'medium';
    
    return 'low';
  }

  /**
   * Determine category based on content analysis
   */
  private determineCategory(description: string, title: string): 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other' {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('bias') || text.includes('discrimination') || text.includes('unfair')) return 'bias';
    if (text.includes('privacy') || text.includes('data') || text.includes('personal')) return 'privacy';
    if (text.includes('security') || text.includes('hack') || text.includes('breach')) return 'security';
    if (text.includes('misinformation') || text.includes('false') || text.includes('incorrect')) return 'misinformation';
    if (text.includes('safety') || text.includes('harm') || text.includes('injury')) return 'safety';
    
    return 'other';
  }

  /**
   * Extract domains from affected parties
   */
  private extractDomains(affectedParties: string[], deployers: string[], developers: string[]): string[] {
    const allParties = [...affectedParties, ...deployers, ...developers];
    const domains = new Set<string>();
    
    allParties.forEach(party => {
      const partyLower = party.toLowerCase();
      if (partyLower.includes('legal') || partyLower.includes('law')) domains.add('legal');
      if (partyLower.includes('health') || partyLower.includes('medical')) domains.add('healthcare');
      if (partyLower.includes('criminal') || partyLower.includes('justice')) domains.add('criminal_justice');
      if (partyLower.includes('finance') || partyLower.includes('bank')) domains.add('finance');
      if (partyLower.includes('education') || partyLower.includes('school')) domains.add('education');
      if (partyLower.includes('transport') || partyLower.includes('vehicle')) domains.add('transportation');
    });
    
    return Array.from(domains);
  }

  /**
   * Extract legal implications from content
   */
  private extractLegalImplications(description: string, category: string): string[] {
    const implications: string[] = [];
    const text = description.toLowerCase();
    
    if (text.includes('discrimination') || text.includes('bias')) {
      implications.push('Potential discrimination claims');
    }
    if (text.includes('privacy') || text.includes('data')) {
      implications.push('Privacy law compliance issues');
    }
    if (text.includes('safety') || text.includes('harm')) {
      implications.push('Product liability concerns');
    }
    if (text.includes('security') || text.includes('breach')) {
      implications.push('Cybersecurity regulatory requirements');
    }
    
    return implications;
  }

  /**
   * Generate mitigation suggestions based on category and severity
   */
  private generateMitigationSuggestions(category: string, severity: string): string[] {
    const suggestions: string[] = [];
    
    if (category === 'bias') {
      suggestions.push('Implement bias detection algorithms', 'Regular fairness audits');
    }
    if (category === 'privacy') {
      suggestions.push('Enhanced data protection measures', 'Privacy impact assessments');
    }
    if (category === 'security') {
      suggestions.push('Security vulnerability assessments', 'Penetration testing');
    }
    if (category === 'misinformation') {
      suggestions.push('Fact-checking protocols', 'Source verification systems');
    }
    if (category === 'safety') {
      suggestions.push('Safety monitoring systems', 'Risk assessment protocols');
    }
    
    if (severity === 'critical' || severity === 'high') {
      suggestions.push('Immediate review and remediation', 'Enhanced monitoring');
    }
    
    return suggestions;
  }

  /**
   * Transform API data to our format
   */
  private transformAPIData(data: any): AIIDIncident[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id || item.incident_id || Math.random().toString(36).substr(2, 9),
      title: item.title || item.name || 'Untitled Incident',
      description: item.description || item.summary || '',
      date: item.date || item.created_at || new Date().toISOString(),
      severity: this.mapSeverity(item.severity || item.risk_level || 'medium'),
      category: this.mapCategory(item.category || item.type || 'other'),
      keywords: this.extractKeywords(item),
      mitigation: this.extractMitigation(item),
      affected_domains: item.affected_domains || item.domains || [],
      legal_implications: item.legal_implications || item.legal_issues || []
    }));
  }

  /**
   * Map severity levels
   */
  private mapSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      '1': 'low',
      '2': 'medium', 
      '3': 'high',
      '4': 'critical',
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical',
      'severe': 'critical',
      'minor': 'low'
    };
    
    return severityMap[severity.toLowerCase()] || 'medium';
  }

  /**
   * Map categories
   */
  private mapCategory(category: string): 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other' {
    const categoryMap: Record<string, 'bias' | 'privacy' | 'security' | 'misinformation' | 'safety' | 'other'> = {
      'bias': 'bias',
      'discrimination': 'bias',
      'fairness': 'bias',
      'privacy': 'privacy',
      'data_protection': 'privacy',
      'security': 'security',
      'vulnerability': 'security',
      'misinformation': 'misinformation',
      'disinformation': 'misinformation',
      'safety': 'safety',
      'harm': 'safety'
    };
    
    return categoryMap[category.toLowerCase()] || 'other';
  }

  /**
   * Extract keywords from incident data
   */
  private extractKeywords(item: any): string[] {
    const keywords: string[] = [];
    
    // Extract from various fields
    if (item.keywords) {
      keywords.push(...(Array.isArray(item.keywords) ? item.keywords : [item.keywords]));
    }
    
    if (item.tags) {
      keywords.push(...(Array.isArray(item.tags) ? item.tags : [item.tags]));
    }
    
    if (item.title) {
      keywords.push(...this.extractKeywordsFromText(item.title));
    }
    
    if (item.description) {
      keywords.push(...this.extractKeywordsFromText(item.description));
    }
    
    return [...new Set(keywords)].filter(k => k && k.length > 2);
  }

  /**
   * Extract keywords from text
   */
  private extractKeywordsFromText(text: string): string[] {
    // Simple keyword extraction - in production, use NLP libraries
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 10); // Limit to 10 keywords
  }

  /**
   * Extract mitigation strategies
   */
  private extractMitigation(item: any): string[] {
    const mitigation: string[] = [];
    
    if (item.mitigation) {
      mitigation.push(...(Array.isArray(item.mitigation) ? item.mitigation : [item.mitigation]));
    }
    
    if (item.recommendations) {
      mitigation.push(...(Array.isArray(item.recommendations) ? item.recommendations : [item.recommendations]));
    }
    
    if (item.solutions) {
      mitigation.push(...(Array.isArray(item.solutions) ? item.solutions : [item.solutions]));
    }
    
    return [...new Set(mitigation)].filter(m => m && m.length > 0);
  }

  /**
   * Remove duplicate incidents
   */
  private removeDuplicates(incidents: AIIDIncident[]): AIIDIncident[] {
    const seen = new Set<string>();
    return incidents.filter(incident => {
      if (seen.has(incident.id)) {
        return false;
      }
      seen.add(incident.id);
      return true;
    });
  }

  /**
   * Add custom data source
   */
  addDataSource(source: AIIDDataSource): void {
    this.sources.push(source);
  }

  /**
   * Get available sources
   */
  getSources(): AIIDDataSource[] {
    return [...this.sources];
  }
}

// Export singleton instance
export const aiidLoader = new AIIDDataLoader();
