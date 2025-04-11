import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const userId = params?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Convert string userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const submissions = await Submission.find({ userId: objectId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ 
      success: true,
      submissions: submissions.map(sub => ({
        ...sub,
        _id: sub._id.toString(),
        userId: sub.userId.toString(),
        createdAt: sub.createdAt?.toISOString(),
        updatedAt: sub.updatedAt?.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use decoded user ID instead of params
    const userId = decoded.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    if (!body.websiteUrl || !body.figmaId) {
      return NextResponse.json({ error: 'Website URL and Figma ID are required' }, { status: 400 });
    }

    const newSubmission = new Submission({
      userId: new mongoose.Types.ObjectId(userId),
      websiteUrl: body.websiteUrl,
      figmaId: body.figmaId,
      output: body.output
    });

    await newSubmission.save();
    
    return NextResponse.json({ 
      success: true, 
      submission: {
        ...newSubmission.toObject(),
        _id: newSubmission._id.toString(),
        userId: newSubmission.userId.toString()
      }
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ 
      error: 'Failed to save submission',
      details: error.message 
    }, { status: 500 });
  }
}