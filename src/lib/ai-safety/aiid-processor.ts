/**
 * AIID (Artificial Intelligence Incident Database) Data Processor
 * Processes AIID data to implement safety measures and prevent known AI incidents
 */

export interface AIIDIncident {
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

export interface SafetyPattern {
  pattern: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  detection_keywords: string[];
  prevention_measures: string[];
  category: string;
}

export class AIIDSafetyProcessor {
  private incidents: AIIDIncident[] = [];
  private safetyPatterns: SafetyPattern[] = [];
  private riskThresholds = {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
    critical: 0.9
  };

  constructor(aiidData?: AIIDIncident[]) {
    if (aiidData) {
      this.loadAIIDData(aiidData);
    }
  }

  /**
   * Load AIID data and generate safety patterns
   */
  loadAIIDData(incidents: AIIDIncident[]): void {
    this.incidents = incidents;
    this.generateSafetyPatterns();
    console.log(`Loaded ${incidents.length} AIID incidents and generated ${this.safetyPatterns.length} safety patterns`);
  }

  /**
   * Generate safety patterns from AIID incidents
   */
  private generateSafetyPatterns(): void {
    const patterns = new Map<string, SafetyPattern>();

    this.incidents.forEach(incident => {
      // Extract keywords and create patterns
      const keywords = incident.keywords || [];
      const category = incident.category;
      const severity = incident.severity;

      keywords.forEach(keyword => {
        const patternKey = `${category}-${keyword.toLowerCase()}`;
        
        if (!patterns.has(patternKey)) {
          patterns.set(patternKey, {
            pattern: keyword,
            risk_level: severity,
            detection_keywords: [keyword],
            prevention_measures: incident.mitigation || [],
            category: category
          });
        } else {
          const existing = patterns.get(patternKey)!;
          existing.detection_keywords.push(keyword);
          existing.prevention_measures.push(...(incident.mitigation || []));
          
          // Upgrade risk level if this incident is more severe
          if (this.getSeverityScore(severity) > this.getSeverityScore(existing.risk_level)) {
            existing.risk_level = severity;
          }
        }
      });
    });

    this.safetyPatterns = Array.from(patterns.values());
  }

  /**
   * Analyze query for potential safety risks
   */
  analyzeQuerySafety(query: string, context?: string): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    detectedPatterns: SafetyPattern[];
    recommendations: string[];
    warnings: string[];
  } {
    const queryText = `${query} ${context || ''}`.toLowerCase();
    const detectedPatterns: SafetyPattern[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Check against safety patterns
    this.safetyPatterns.forEach(pattern => {
      const matches = pattern.detection_keywords.some(keyword => 
        queryText.includes(keyword.toLowerCase())
      );

      if (matches) {
        detectedPatterns.push(pattern);
        
        // Add warnings based on risk level
        if (pattern.risk_level === 'critical') {
          warnings.push(`CRITICAL: Detected high-risk pattern "${pattern.pattern}" - ${pattern.category} risk`);
        } else if (pattern.risk_level === 'high') {
          warnings.push(`HIGH RISK: Detected pattern "${pattern.pattern}" - ${pattern.category} risk`);
        }

        // Add recommendations
        recommendations.push(...pattern.prevention_measures);
      }
    });

    // Determine overall risk level
    const riskLevel = this.calculateOverallRisk(detectedPatterns);

    return {
      riskLevel,
      detectedPatterns,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      warnings
    };
  }

  /**
   * Analyze response for safety issues
   */
  analyzeResponseSafety(response: string): {
    isSafe: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for bias indicators
    if (this.detectBias(response)) {
      issues.push('Potential bias detected in response');
      suggestions.push('Review response for balanced perspective and diverse viewpoints');
    }

    // Check for misinformation patterns
    if (this.detectMisinformation(response)) {
      issues.push('Potential misinformation patterns detected');
      suggestions.push('Verify all facts and provide source citations');
    }

    // Check for privacy concerns
    if (this.detectPrivacyIssues(response)) {
      issues.push('Potential privacy concerns detected');
      suggestions.push('Remove or anonymize personal information');
    }

    return {
      isSafe: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * GOLD STANDARD: Validate AI response against AIID safety standards
   * This acts as a comprehensive safety check before sending response to client
   */
  validateResponseSafety(response: string, originalQuery: string): {
    isSafe: boolean;
    violations: string[];
    warnings: string[];
    corrections: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    mustBlock: boolean;
  } {
    const responseLower = response.toLowerCase();
    const queryLower = originalQuery.toLowerCase();
    
    const violations: string[] = [];
    const warnings: string[] = [];
    const corrections: string[] = [];
    let isSafe = true;
    let mustBlock = false;

    // 1. HALLUCINATION DETECTION - Check for fabricated information
    const hallucinationPatterns = [
      'according to my knowledge',
      'i believe',
      'i think',
      'it seems',
      'possibly',
      'might be',
      'could be',
      'appears to be',
      'suggests that',
      'indicates that',
      'definitely',
      'certainly',
      'without doubt',
      'guaranteed'
    ];

    const hasUncertainty = hallucinationPatterns.some(pattern => 
      responseLower.includes(pattern)
    );

    if (hasUncertainty) {
      violations.push('Response contains uncertain or fabricated language that may indicate hallucination');
      corrections.push('Replace uncertain language with verified facts and proper citations');
      isSafe = false;
    }

    // 2. CITATION VALIDATION - Check for proper legal citations
    const citationPatterns = [
      /\b\d{4}\s+[A-Z][a-z]+\s+\d+\b/g, // Case citations like "2023 Smith 123"
      /\b[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+/g, // Case names like "Smith v. Jones"
      /\b\d+\s+U\.S\.\s+\d+/g, // Supreme Court citations
      /\b\d+\s+F\.\d+d\s+\d+/g, // Federal court citations
    ];

    const hasCitations = citationPatterns.some(pattern => pattern.test(response));
    if (hasCitations && !response.includes('[[')) {
      violations.push('Response contains uncited legal references');
      corrections.push('All legal references must be properly cited with [[C#]] format');
      isSafe = false;
    }

    // 3. BIAS DETECTION - Check for biased language
    const biasPatterns = [
      'always', 'never', 'all', 'none', 'every', 'no one',
      'typically', 'usually', 'generally', 'most people',
      'obviously', 'clearly', 'undoubtedly', 'of course',
      'naturally', 'inevitably', 'unavoidably'
    ];

    const hasBiasLanguage = biasPatterns.some(pattern => 
      responseLower.includes(pattern)
    );

    if (hasBiasLanguage) {
      warnings.push('Response contains potentially biased language');
      corrections.push('Use more neutral, evidence-based language');
    }

    // 4. SECURITY VALIDATION - Check for security-sensitive information
    const securityPatterns = [
      'password', 'secret', 'confidential', 'private key',
      'ssn', 'social security', 'credit card', 'bank account',
      'api key', 'token', 'authentication', 'login'
    ];

    const hasSecurityInfo = securityPatterns.some(pattern => 
      responseLower.includes(pattern)
    );

    if (hasSecurityInfo) {
      violations.push('Response contains security-sensitive information');
      corrections.push('Remove or anonymize sensitive information');
      isSafe = false;
      mustBlock = true;
    }

    // 5. PRIVACY PROTECTION - Check for privacy violations
    const privacyPatterns = [
      'personal information', 'private data', 'client details',
      'confidential client', 'attorney-client privilege'
    ];

    const hasPrivacyIssues = privacyPatterns.some(pattern => 
      responseLower.includes(pattern) && !responseLower.includes('protect')
    );

    if (hasPrivacyIssues) {
      violations.push('Response may violate privacy standards');
      corrections.push('Ensure proper privacy protection measures are mentioned');
      isSafe = false;
    }

    // 6. LEGAL ACCURACY - Check for proper legal structure
    const hasLegalStructure = responseLower.includes('analysis') || 
                             responseLower.includes('precedent') || 
                             responseLower.includes('jurisdiction') ||
                             responseLower.includes('court') ||
                             responseLower.includes('statute') ||
                             responseLower.includes('regulation');

    if (!hasLegalStructure && queryLower.includes('legal')) {
      warnings.push('Response lacks proper legal analysis structure');
      corrections.push('Include legal analysis framework and precedents');
    }

    // 7. RESPONSE COMPLETENESS - Check for adequate response length
    if (response.length < 100) {
      warnings.push('Response may be too brief for comprehensive legal analysis');
      corrections.push('Provide more detailed legal analysis');
    }

    // 8. FACT VERIFICATION - Check for verifiable claims
    const unverifiablePatterns = [
      'studies show', 'research indicates', 'experts agree',
      'it is known', 'it is established', 'it is proven'
    ];

    const hasUnverifiableClaims = unverifiablePatterns.some(pattern => 
      responseLower.includes(pattern) && !response.includes('[[')
    );

    if (hasUnverifiableClaims) {
      violations.push('Response contains unverifiable claims without citations');
      corrections.push('Provide proper citations for all claims');
      isSafe = false;
    }

    // 9. CLIENT SAFETY - Check for potentially harmful advice
    const harmfulPatterns = [
      'ignore', 'disregard', 'skip', 'avoid',
      'do not consult', 'do not seek', 'do not contact'
    ];

    const hasHarmfulAdvice = harmfulPatterns.some(pattern => 
      responseLower.includes(pattern) && 
      (responseLower.includes('lawyer') || responseLower.includes('attorney'))
    );

    if (hasHarmfulAdvice) {
      violations.push('Response may contain potentially harmful legal advice');
      corrections.push('Ensure proper legal disclaimers and professional consultation recommendations');
      isSafe = false;
      mustBlock = true;
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (violations.length > 0) {
      if (mustBlock) {
        riskLevel = 'critical';
      } else if (violations.length > 2) {
        riskLevel = 'high';
      } else {
        riskLevel = 'medium';
      }
    } else if (warnings.length > 0) {
      riskLevel = 'medium';
    }

    return {
      isSafe,
      violations,
      warnings,
      corrections,
      riskLevel,
      mustBlock
    };
  }

  /**
   * Get safety recommendations for specific legal domain
   */
  getDomainSafetyRecommendations(domain: string): string[] {
    const domainIncidents = this.incidents.filter(incident => 
      incident.affected_domains?.includes(domain) || 
      incident.legal_implications?.some(impl => impl.toLowerCase().includes(domain))
    );

    const recommendations = new Set<string>();
    domainIncidents.forEach(incident => {
      incident.mitigation?.forEach(mitigation => recommendations.add(mitigation));
    });

    return Array.from(recommendations);
  }

  /**
   * Get recent incidents for transparency
   */
  getRecentIncidents(limit: number = 5): AIIDIncident[] {
    return this.incidents
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Get safety statistics
   */
  getSafetyStats(): {
    totalIncidents: number;
    incidentsByCategory: Record<string, number>;
    incidentsBySeverity: Record<string, number>;
    patternsGenerated: number;
  } {
    const incidentsByCategory: Record<string, number> = {};
    const incidentsBySeverity: Record<string, number> = {};

    this.incidents.forEach(incident => {
      incidentsByCategory[incident.category] = (incidentsByCategory[incident.category] || 0) + 1;
      incidentsBySeverity[incident.severity] = (incidentsBySeverity[incident.severity] || 0) + 1;
    });

    return {
      totalIncidents: this.incidents.length,
      incidentsByCategory,
      incidentsBySeverity,
      patternsGenerated: this.safetyPatterns.length
    };
  }

  // Private helper methods
  private getSeverityScore(severity: string): number {
    const scores = { low: 1, medium: 2, high: 3, critical: 4 };
    return scores[severity as keyof typeof scores] || 0;
  }

  private calculateOverallRisk(patterns: SafetyPattern[]): 'low' | 'medium' | 'high' | 'critical' {
    if (patterns.length === 0) return 'low';
    
    const maxSeverity = Math.max(...patterns.map(p => this.getSeverityScore(p.risk_level)));
    const severityMap = { 1: 'low', 2: 'medium', 3: 'high', 4: 'critical' };
    return severityMap[maxSeverity as keyof typeof severityMap] || 'low';
  }

  private detectBias(text: string): boolean {
    const biasIndicators = [
      'only', 'always', 'never', 'all', 'none', 'every',
      'typical', 'normal', 'abnormal', 'unusual'
    ];
    
    return biasIndicators.some(indicator => 
      text.toLowerCase().includes(indicator)
    );
  }

  private detectMisinformation(text: string): boolean {
    const misinformationPatterns = [
      'definitely', 'certainly', 'without doubt', 'guaranteed',
      'proven fact', 'scientific consensus'
    ];
    
    return misinformationPatterns.some(pattern => 
      text.toLowerCase().includes(pattern)
    );
  }

  private detectPrivacyIssues(text: string): boolean {
    const privacyPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{3}-\d{4}\b/ // Phone
    ];
    
    return privacyPatterns.some(pattern => pattern.test(text));
  }
}

// Export singleton instance
export const aiidProcessor = new AIIDSafetyProcessor();
