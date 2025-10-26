import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface AdaptiveAnalysis {
  noveltyScore: number; // 0-100
  learningApproach: string;
  knowledgeGaps: string[];
  adaptationStrategy: string;
  researchPriorities: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { legalScenario, context, existingKnowledge } = await req.json();
    if (!legalScenario) return NextResponse.json({ error: 'Legal scenario required' }, { status: 400 });

    const openai = createOpenAI();

    const prompt = `You are an expert in adaptive AI learning for novel legal scenarios. Analyze this unprecedented legal situation:

LEGAL SCENARIO: "${legalScenario}"
CONTEXT: "${context || 'No additional context'}"
EXISTING KNOWLEDGE BASE: "${existingKnowledge || 'Standard legal knowledge'}" 

Provide an adaptive learning analysis including:

1. NOVELTY ASSESSMENT:
   - How unprecedented is this scenario (0-100%)
   - What makes it unique or unprecedented
   - Similar but distinct precedents
   - Novel legal questions raised

2. KNOWLEDGE GAP ANALYSIS:
   - What legal knowledge is missing
   - Areas requiring new research
   - Uncharted legal territory
   - Emerging legal concepts

3. ADAPTIVE LEARNING STRATEGY:
   - How to approach this novel scenario
   - Learning methodology for unprecedented cases
   - Research prioritization
   - Knowledge acquisition approach

4. ANALOGICAL REASONING:
   - Similar legal principles from other areas
   - Analogous cases from different jurisdictions
   - Related legal concepts that might apply
   - Creative legal reasoning approaches

5. RESEARCH PRIORITIES:
   - Most important areas to research
   - Key legal questions to answer
   - Critical precedents to find
   - Regulatory guidance to seek

6. CONFIDENCE ASSESSMENT:
   - Confidence level in current analysis
   - Areas of highest uncertainty
   - What would increase confidence
   - Risk factors in novel scenarios

7. ADAPTATION RECOMMENDATIONS:
   - How to adapt existing legal frameworks
   - Creative legal solutions
   - Innovative approaches to consider
   - Strategic thinking for unprecedented cases

8. LEARNING FRAMEWORK:
   - Step-by-step learning approach
   - Knowledge building strategy
   - Continuous adaptation process
   - Long-term learning goals

Format your response as an adaptive learning analysis that demonstrates how AI can evolve and learn from unprecedented legal scenarios.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 3000,
    });

    const analysis = response.choices[0]?.message?.content || 'No adaptive learning analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      scenario: legalScenario,
      context: context || null,
      existingKnowledge: existingKnowledge || null
    });

  } catch (err) {
    console.error('Adaptive learning analysis error:', err);
    return NextResponse.json({ error: 'Adaptive learning analysis failed' }, { status: 500 });
  }
}
