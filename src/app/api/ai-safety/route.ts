import { NextRequest, NextResponse } from 'next/server';
import { aiidProcessor } from '@/lib/ai-safety/aiid-processor';
import { aiidLoader } from '@/lib/ai-safety/aiid-loader';
import { initializeAIIDData, isAIIDInitialized } from '@/lib/ai-safety/init-aiid';

export const runtime = 'nodejs';

/**
 * AI Safety API Endpoint
 * Provides AI safety analysis and AIID data integration
 */

export async function POST(req: NextRequest) {
  try {
    // Initialize AIID data if not already done
    if (!isAIIDInitialized()) {
      await initializeAIIDData();
    }
    
    const { action, query, response, context } = await req.json();

    switch (action) {
      case 'analyze_query':
        if (!query) {
          return NextResponse.json({ error: 'Query required for analysis' }, { status: 400 });
        }
        
        const queryAnalysis = aiidProcessor.analyzeQuerySafety(query, context);
        return NextResponse.json({
          success: true,
          analysis: queryAnalysis,
          timestamp: new Date().toISOString()
        });

      case 'analyze_response':
        if (!response) {
          return NextResponse.json({ error: 'Response required for analysis' }, { status: 400 });
        }
        
        const responseAnalysis = aiidProcessor.analyzeResponseSafety(response);
        return NextResponse.json({
          success: true,
          analysis: responseAnalysis,
          timestamp: new Date().toISOString()
        });

      case 'validate_response':
        if (!response) {
          return NextResponse.json({ error: 'Response required for validation' }, { status: 400 });
        }
        
        const validation = aiidProcessor.validateResponseSafety(response, query || '');
        return NextResponse.json({
          success: true,
          validation,
          timestamp: new Date().toISOString()
        });

      case 'get_safety_stats':
        const stats = aiidProcessor.getSafetyStats();
        return NextResponse.json({
          success: true,
          stats,
          timestamp: new Date().toISOString()
        });

      case 'get_recent_incidents':
        const { limit = 5 } = await req.json();
        const incidents = aiidProcessor.getRecentIncidents(limit);
        return NextResponse.json({
          success: true,
          incidents,
          timestamp: new Date().toISOString()
        });

      case 'get_domain_recommendations':
        const { domain } = await req.json();
        if (!domain) {
          return NextResponse.json({ error: 'Domain required' }, { status: 400 });
        }
        
        const recommendations = aiidProcessor.getDomainSafetyRecommendations(domain);
        return NextResponse.json({
          success: true,
          recommendations,
          timestamp: new Date().toISOString()
        });

      case 'load_aiid_data':
        try {
          const incidents = await aiidLoader.loadAllData();
          return NextResponse.json({
            success: true,
            message: `Loaded ${incidents.length} AIID incidents`,
            count: incidents.length,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to load AIID data',
            details: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI Safety API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Initialize AIID data if not already done
    if (!isAIIDInitialized()) {
      await initializeAIIDData();
    }
    
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'get_safety_stats';

    switch (action) {
      case 'get_safety_stats':
        const stats = aiidProcessor.getSafetyStats();
        return NextResponse.json({
          success: true,
          stats,
          timestamp: new Date().toISOString()
        });

      case 'get_recent_incidents':
        const limit = parseInt(url.searchParams.get('limit') || '5');
        const incidents = aiidProcessor.getRecentIncidents(limit);
        return NextResponse.json({
          success: true,
          incidents,
          timestamp: new Date().toISOString()
        });

      case 'get_sources':
        const sources = aiidLoader.getSources();
        return NextResponse.json({
          success: true,
          sources,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI Safety API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
