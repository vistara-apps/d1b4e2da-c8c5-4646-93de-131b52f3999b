import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured') === 'true';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    const filters = {
      ...(type && { type }),
      ...(featured && { featured }),
      ...(tags && tags.length > 0 && { tags })
    };

    const opportunities = await getOpportunities(filters);

    return NextResponse.json({
      success: true,
      data: opportunities,
      count: opportunities.length
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch opportunities',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'type', 'deadline', 'eligibility', 'url'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      );
    }

    // In a real app, this would create the opportunity in the database
    const newOpportunity = {
      opportunityId: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      featured: body.featured || false
    };

    return NextResponse.json({
      success: true,
      data: newOpportunity,
      message: 'Opportunity created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create opportunity',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
