import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const VALID_LEVELS = ['D1', 'D2', 'D3', 'NAIA', 'Junior College', 'NJCAA'];
const MAX_SPORT_LENGTH = 50;
const MAX_POSITION_LENGTH = 50;
const MAX_HIGHLIGHTS_LENGTH = 1000;

interface VideoClipRequest {
  sport: string;
  position: string;
  level: string;
  highlights?: string;
}

function validateInput(body: unknown): VideoClipRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { sport, position, level, highlights } = body as Record<string, unknown>;

  // Validate sport
  if (typeof sport !== 'string' || sport.trim().length === 0) {
    throw new Error('Sport is required and must be a non-empty string');
  }
  if (sport.length > MAX_SPORT_LENGTH) {
    throw new Error(`Sport must be ${MAX_SPORT_LENGTH} characters or less`);
  }

  // Validate position
  if (typeof position !== 'string' || position.trim().length === 0) {
    throw new Error('Position is required and must be a non-empty string');
  }
  if (position.length > MAX_POSITION_LENGTH) {
    throw new Error(`Position must be ${MAX_POSITION_LENGTH} characters or less`);
  }

  // Validate level
  if (typeof level !== 'string' || !VALID_LEVELS.includes(level)) {
    throw new Error(`Level must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  // Validate highlights (optional)
  if (highlights !== undefined && highlights !== null) {
    if (typeof highlights !== 'string') {
      throw new Error('Highlights must be a string');
    }
    if (highlights.length > MAX_HIGHLIGHTS_LENGTH) {
      throw new Error(`Highlights must be ${MAX_HIGHLIGHTS_LENGTH} characters or less`);
    }
  }

  return {
    sport: sport.trim(),
    position: position.trim(),
    level,
    highlights: typeof highlights === 'string' ? highlights.trim() : undefined,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    // Parse and validate input
    const rawBody = await req.json();
    const { sport, position, level, highlights } = validateInput(rawBody);
    
    console.log(`Video Clip Advisor request: ${sport} - ${position} - ${level}`);

    // Build the prompt for Perplexity
    const userMessage = `I'm a ${position} in ${sport} looking to create a recruiting video for ${level} college programs.
${highlights ? `My strengths/highlights include: ${highlights}` : ''}

Please provide detailed, actionable advice on:
1. What specific types of clips/plays should I include for my position?
2. How long should the video be and how should it be structured?
3. What do college coaches at this level specifically look for?
4. What common mistakes should I avoid in my recruiting video?
5. Any technical tips (camera angles, quality, editing)?

Please be specific to my sport and position, and cite current best practices from recruiting experts.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert college athletic recruiting advisor with deep knowledge of what college coaches look for in recruiting videos. Provide specific, actionable advice tailored to the athlete\'s sport, position, and target level of play. Include current best practices and cite sources when possible.' 
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity response received successfully');

    const advice = data.choices?.[0]?.message?.content || 'Unable to generate advice at this time.';
    const citations = data.citations || [];

    return new Response(
      JSON.stringify({ 
        advice,
        citations,
        sport,
        position,
        level
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: unknown) {
    console.error('Error in video-clip-advisor:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const status = errorMessage.includes('required') || errorMessage.includes('must be') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status 
      }
    );
  }
});
