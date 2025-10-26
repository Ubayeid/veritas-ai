import type { Citation } from '@/types/chat';

const formatAuthorsAPA = (authors: string[]): string => {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
};

// Legal citation formatting functions
const formatCaseName = (caseName: string): string => {
  return caseName.replace(/\s+v\.\s+/gi, ' v. ').trim();
};

const formatLegalCitation = (citation: Citation): string => {
  const caseName = formatCaseName(citation.title);
  const volume = citation.volume || '';
  const reporter = citation.journal || '';
  const page = citation.page || '';
  const year = citation.year || '';
  
  if (reporter && volume && page) {
    return `${caseName}, ${volume} ${reporter} ${page} (${year})`;
  }
  
  return `${caseName} (${year})`;
};

export const formatInTextCitation = (citation: Citation): string => {
  // For legal citations, use case name in text
  const caseName = formatCaseName(citation.title);
  const year = citation.year ?? '';
  return year ? `${caseName} (${year})` : caseName;
};

export const formatReferenceAPA = (citation: Citation): string => {
  // Check if this is a legal citation (has case law indicators)
  if (citation.journal && (citation.journal.includes('F.') || citation.journal.includes('U.S.') || citation.journal.includes('S.Ct.'))) {
    return formatLegalCitation(citation);
  }
  
  // Fallback to academic format
  const authors = citation.authors.join(', ');
  const year = citation.year ? `(${citation.year})` : '(n.d.)';
  const title = citation.title.trim();
  const venue = citation.journal ? ` ${citation.journal}.` : '';

  return `${authors} ${year}. ${title}.${venue}`.replace(/\s+/g, ' ').trim();
};