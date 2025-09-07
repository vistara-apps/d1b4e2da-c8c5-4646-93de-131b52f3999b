import { NextRequest, NextResponse } from 'next/server';
import { getMasterclasses } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPremium = searchParams.get('premium');
    const difficulty = searchParams.get('difficulty');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    let premiumFilter: boolean | undefined;
    if (isPremium === 'true') premiumFilter = true;
    if (isPremium === 'false') premiumFilter = false;

    const masterclasses = await getMasterclasses(premiumFilter);

    // Apply additional client-side filters
    let filteredMasterclasses = masterclasses;

    if (difficulty) {
      filteredMasterclasses = filteredMasterclasses.filter(
        (mc: any) => mc.difficulty === difficulty
      );
    }

    if (tags && tags.length > 0) {
      filteredMasterclasses = filteredMasterclasses.filter(
        (mc: any) => tags.some(tag => mc.tags.includes(tag))
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredMasterclasses,
      count: filteredMasterclasses.length
    });
  } catch (error) {
    console.error('Error fetching masterclasses:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch masterclasses',
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
    const requiredFields = ['title', 'description', 'url', 'tags', 'difficulty'];
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

    // Validate difficulty level
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(body.difficulty)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid difficulty level',
          validDifficulties 
        },
        { status: 400 }
      );
    }

    // In a real app, this would create the masterclass in the database
    const newMasterclass = {
      masterclassId: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      isPremium: body.isPremium || false
    };

    return NextResponse.json({
      success: true,
      data: newMasterclass,
      message: 'Masterclass created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating masterclass:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create masterclass',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
