/**
 * Firebase Admin SDK for server-side use only (API routes, Server Actions, server components).
 * Do not import this file from client components.
 */
import * as admin from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { App } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  // Check if app is already initialized
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error(
      'Firebase Admin: Set NEXT_PUBLIC_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID in .env'
    );
  }

  if (clientEmail && privateKey) {
    const key = privateKey.replace(/\\n/g, '\n');
    adminApp = initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: key,
      }),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    adminApp = initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    throw new Error(
      'Firebase Admin: Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS in .env'
    );
  }

  return adminApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
