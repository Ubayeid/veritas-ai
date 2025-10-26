import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface DocumentAnalysis {
  documentCount: number;
  crossReferences: string[];
  contradictions: string[];
  synergies: string[];
  comprehensiveAnalysis: string;
  riskAssessment: string;
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { documents, analysisFocus } = await req.json();
    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json({ error: 'Documents array required' }, { status: 400 });
    }

    const openai = createOpenAI();

    const documentsText = documents.map((doc, index) => 
      `DOCUMENT ${index + 1}:\n${doc.content || doc}\n---`
    ).join('\n\n');

    const prompt = `You are an expert legal analyst specializing in multi-document analysis. Analyze these interconnected legal documents:

DOCUMENTS TO ANALYZE:
${documentsText}

ANALYSIS FOCUS: "${analysisFocus || 'comprehensive cross-document analysis'}"

Provide a comprehensive multi-document analysis including:

1. CROSS-DOCUMENT ANALYSIS:
   - How documents relate to each other
   - Cross-references and connections
   - Document hierarchy and dependencies
   - Information flow between documents

2. CONTRADICTION DETECTION:
   - Conflicting terms or provisions
   - Inconsistent legal positions
   - Contradictory obligations or rights
   - Potential legal conflicts

3. SYNERGY IDENTIFICATION:
   - How documents work together
   - Complementary provisions
   - Strengthened legal positions
   - Enhanced protection or benefits

4. COMPREHENSIVE RISK ASSESSMENT:
   - Overall risk profile across all documents
   - Cumulative risk factors
   - Risk mitigation strategies
   - Priority risk areas

5. STRATEGIC RECOMMENDATIONS:
   - How to optimize document relationships
   - Areas requiring clarification
   - Potential improvements or amendments
   - Strategic advantages to leverage

6. LEGAL COMPLIANCE CHECK:
   - Compliance across all documents
   - Regulatory requirements
   - Legal standard adherence
   - Best practice recommendations

7. DOCUMENT OPTIMIZATION:
   - How to improve document integration
   - Missing provisions or protections
   - Redundancy identification
   - Efficiency improvements

Format your response as a comprehensive multi-document analysis that provides strategic insights across the entire document ecosystem.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 4000,
    });

    const analysis = response.choices[0]?.message?.content || 'No multi-document analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      documentCount: documents.length,
      analysisFocus: analysisFocus || 'comprehensive'
    });

  } catch (err) {
    console.error('Multi-document analysis error:', err);
    return NextResponse.json({ error: 'Multi-document analysis failed' }, { status: 500 });
  }
}
