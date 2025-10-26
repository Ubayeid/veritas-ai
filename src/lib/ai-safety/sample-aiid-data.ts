/**
 * Sample AIID data for testing
 */

import { AIIDIncident } from './aiid-processor';

export const sampleAIIDData: AIIDIncident[] = [
  {
    id: 'aiid_001',
    title: 'AI Bias in Legal Sentencing Algorithms',
    description: 'Machine learning algorithms used for criminal sentencing showed significant racial bias, with Black defendants receiving longer sentences for similar crimes compared to white defendants.',
    date: '2023-06-15T10:30:00Z',
    severity: 'high',
    category: 'bias',
    keywords: ['sentencing', 'racial bias', 'criminal justice', 'algorithm', 'discrimination'],
    mitigation: [
      'Implement bias detection algorithms',
      'Regular fairness audits of sentencing data',
      'Diverse training data review',
      'Human oversight requirements'
    ],
    affected_domains: ['criminal_justice', 'legal', 'sentencing'],
    legal_implications: [
      'Potential civil rights violations',
      'Constitutional equal protection claims',
      'Regulatory compliance issues'
    ]
  },
  {
    id: 'aiid_002', 
    title: 'Privacy Breach in Legal Document Analysis',
    description: 'AI system processing legal documents inadvertently exposed confidential client information due to insufficient data anonymization protocols.',
    date: '2023-08-22T14:15:00Z',
    severity: 'critical',
    category: 'privacy',
    keywords: ['privacy', 'confidentiality', 'data breach', 'legal documents', 'anonymization'],
    mitigation: [
      'Implement end-to-end encryption',
      'Enhanced data anonymization',
      'Access control protocols',
      'Regular security audits'
    ],
    affected_domains: ['legal', 'privacy', 'confidentiality'],
    legal_implications: [
      'Attorney-client privilege violations',
      'GDPR compliance issues',
      'Professional liability claims'
    ]
  },
  {
    id: 'aiid_003',
    title: 'Misinformation in Legal Research AI',
    description: 'AI legal research tool provided outdated case law and incorrect legal precedents, leading to flawed legal advice and potential malpractice claims.',
    date: '2023-11-10T09:45:00Z',
    severity: 'high',
    category: 'misinformation',
    keywords: ['misinformation', 'outdated data', 'legal precedents', 'malpractice', 'verification'],
    mitigation: [
      'Real-time data validation',
      'Source verification protocols',
      'Regular database updates',
      'Confidence scoring for responses'
    ],
    affected_domains: ['legal_research', 'legal_advice', 'malpractice'],
    legal_implications: [
      'Professional malpractice claims',
      'Bar association investigations',
      'Client harm and liability'
    ]
  },
  {
    id: 'aiid_004',
    title: 'AI Security Vulnerability in Legal Platforms',
    description: 'Critical security vulnerability in AI-powered legal platform allowed unauthorized access to sensitive case files and client data.',
    date: '2024-01-05T16:20:00Z',
    severity: 'critical',
    category: 'security',
    keywords: ['security', 'vulnerability', 'unauthorized_access', 'data_breach', 'cybersecurity'],
    mitigation: [
      'Immediate security patch deployment',
      'Penetration testing protocols',
      'Multi-factor authentication',
      'Regular security monitoring'
    ],
    affected_domains: ['cybersecurity', 'legal_platforms', 'data_protection'],
    legal_implications: [
      'Data breach notification requirements',
      'Regulatory investigations',
      'Client notification obligations'
    ]
  },
  {
    id: 'aiid_005',
    title: 'AI Safety Issue in Contract Analysis',
    description: 'AI system failed to identify critical contract clauses, leading to unfavorable terms being accepted by clients without proper review.',
    date: '2024-02-14T11:30:00Z',
    severity: 'medium',
    category: 'safety',
    keywords: ['contract_analysis', 'safety', 'risk_assessment', 'clause_detection', 'client_harm'],
    mitigation: [
      'Enhanced clause detection algorithms',
      'Human review requirements for critical contracts',
      'Risk assessment protocols',
      'Client notification systems'
    ],
    affected_domains: ['contract_law', 'client_representation', 'risk_management'],
    legal_implications: [
      'Professional liability exposure',
      'Client harm and damages',
      'Malpractice prevention requirements'
    ]
  },
  {
    id: 'aiid_006',
    title: 'Gender Bias in Legal AI Hiring Tools',
    description: 'AI-powered legal hiring platform showed systematic bias against female candidates, filtering out qualified women from consideration.',
    date: '2024-03-20T13:45:00Z',
    severity: 'high',
    category: 'bias',
    keywords: ['gender_bias', 'hiring', 'discrimination', 'employment_law', 'fairness'],
    mitigation: [
      'Bias testing in hiring algorithms',
      'Diverse training data requirements',
      'Regular fairness audits',
      'Human oversight in hiring decisions'
    ],
    affected_domains: ['employment_law', 'hiring', 'discrimination'],
    legal_implications: [
      'Employment discrimination claims',
      'EEOC investigations',
      'Workplace diversity requirements'
    ]
  },
  {
    id: 'aiid_007',
    title: 'AI Hallucination in Legal Brief Generation',
    description: 'AI system generated fictional case citations and legal precedents that appeared authentic but were completely fabricated.',
    date: '2024-04-10T08:30:00Z',
    severity: 'critical',
    category: 'misinformation',
    keywords: ['hallucination', 'fabricated_citations', 'legal_briefs', 'misinformation', 'verification'],
    mitigation: [
      'Citation verification systems',
      'Source validation protocols',
      'Human review requirements',
      'Confidence scoring for generated content'
    ],
    affected_domains: ['legal_writing', 'legal_research', 'malpractice'],
    legal_implications: [
      'Professional malpractice claims',
      'Bar association sanctions',
      'Client trust and reputation damage'
    ]
  },
  {
    id: 'aiid_008',
    title: 'Data Privacy Violation in Legal AI Training',
    description: 'AI system was trained on confidential client data without proper consent, violating attorney-client privilege and data protection laws.',
    date: '2024-05-15T11:20:00Z',
    severity: 'critical',
    category: 'privacy',
    keywords: ['data_privacy', 'training_data', 'attorney_client_privilege', 'consent', 'violation'],
    mitigation: [
      'Consent verification for training data',
      'Data anonymization protocols',
      'Privacy impact assessments',
      'Regular compliance audits'
    ],
    affected_domains: ['privacy_law', 'attorney_ethics', 'data_protection'],
    legal_implications: [
      'Attorney disciplinary actions',
      'Privacy law violations',
      'Client confidentiality breaches'
    ]
  }
];
