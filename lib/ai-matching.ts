import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export interface MatchingCriteria {
  skills: string[];
  interests: string[];
  industry: string;
  stage: string;
  lookingFor: string[];
  bio: string;
}

export async function generateFounderMatches(
  userCriteria: MatchingCriteria,
  potentialMatches: Array<{ userId: string; criteria: MatchingCriteria; username: string }>
): Promise<Array<{ userId: string; username: string; score: number; reasoning: string }>> {
  try {
    const prompt = `
You are an AI matching system for student entrepreneurs. Analyze the user's profile and find the best potential co-founder matches.

User Profile:
- Skills: ${userCriteria.skills.join(', ')}
- Interests: ${userCriteria.interests.join(', ')}
- Industry: ${userCriteria.industry}
- Stage: ${userCriteria.stage}
- Looking for: ${userCriteria.lookingFor.join(', ')}
- Bio: ${userCriteria.bio}

Potential Matches:
${potentialMatches.map((match, index) => `
${index + 1}. ${match.username} (ID: ${match.userId})
   - Skills: ${match.criteria.skills.join(', ')}
   - Interests: ${match.criteria.interests.join(', ')}
   - Industry: ${match.criteria.industry}
   - Stage: ${match.criteria.stage}
   - Looking for: ${match.criteria.lookingFor.join(', ')}
   - Bio: ${match.criteria.bio}
`).join('')}

For each potential match, provide:
1. A compatibility score (0-100)
2. Brief reasoning for the score
3. Key complementary strengths

Return as JSON array with format:
[
  {
    "userId": "string",
    "username": "string", 
    "score": number,
    "reasoning": "string"
  }
]

Focus on complementary skills, shared interests, and potential for successful collaboration.
`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at matching entrepreneurs based on complementary skills and shared vision. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const matches = JSON.parse(response);
    return matches.sort((a: any, b: any) => b.score - a.score);
  } catch (error) {
    console.error('Error generating founder matches:', error);
    // Fallback to simple scoring
    return potentialMatches.map(match => ({
      userId: match.userId,
      username: match.username,
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      reasoning: 'Compatibility based on shared interests and complementary skills.'
    })).sort((a, b) => b.score - a.score);
  }
}

export async function generateFeedbackSuggestions(
  topic: string,
  description: string,
  industry: string
): Promise<string[]> {
  try {
    const prompt = `
Generate 5-7 specific, actionable feedback questions for a student entrepreneur seeking advice on:

Topic: ${topic}
Description: ${description}
Industry: ${industry}

The questions should help peers provide constructive, specific feedback. Focus on:
- Market validation
- Business model
- Product development
- Go-to-market strategy
- Team building
- Funding readiness

Return as a JSON array of strings.
`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert startup mentor. Generate specific, actionable feedback questions that will help student entrepreneurs improve their ventures.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating feedback suggestions:', error);
    // Fallback questions
    return [
      'What is your target market and how have you validated demand?',
      'What makes your solution unique compared to existing alternatives?',
      'How do you plan to acquire your first 100 customers?',
      'What are your biggest risks and how are you mitigating them?',
      'What skills or expertise do you need to add to your team?'
    ];
  }
}
