import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get token and verify user
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const submissions = await Submission.find({ userId })
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
    return NextResponse.json({ error: 'Failed to fetch submissions', success: false }, { status: 500 });
  }
}