import { NextRequest, NextResponse } from 'next/server';
import { findPotentialMatches } from '@/lib/ai-matching';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['currentUser', 'candidates'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          missingFields,
          required: 'currentUser (object with skills, interests, bio), candidates (array of user objects)'
        },
        { status: 400 }
      );
    }

    const { currentUser, candidates } = body;

    // Validate currentUser structure
    if (!currentUser.skills || !currentUser.interests) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid currentUser structure',
          required: 'currentUser must have skills and interests arrays'
        },
        { status: 400 }
      );
    }

    // Validate candidates structure
    if (!Array.isArray(candidates)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid candidates structure',
          required: 'candidates must be an array of user objects'
        },
        { status: 400 }
      );
    }

    const matches = await findPotentialMatches(currentUser, candidates);

    return NextResponse.json({
      success: true,
      data: matches,
      count: matches.length,
      message: 'AI matching completed successfully'
    });
  } catch (error) {
    console.error('Error in AI matching:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'AI matching failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
    message: 'Use POST method to perform AI matching'
  }, { status: 405 });
}
