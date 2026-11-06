import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/firebase/admin';

/**
 * Example API route using Firebase Admin (backend).
 * GET /api/firebase-admin – verifies server-side Firebase is connected.
 */
export async function GET() {
  try {
    const db = getAdminFirestore();
    return NextResponse.json({
      ok: true,
      message: 'Firebase Admin (backend) is connected.',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Firebase Admin error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Firebase Admin not configured',
      },
      { status: 500 }
    );
  }
}
