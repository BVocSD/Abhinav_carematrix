import type { FirebaseOptions } from 'firebase/app';

const envConfig: FirebaseOptions = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
};

const defaultConfig: FirebaseOptions = {
  projectId: 'studio-189760261-c73e4',
  appId: '1:674456812406:web:56184ae97e626144d19857',
  apiKey: 'AIzaSyCHEZ24hvZTx6T_8oTq9uDAtkuyVqv4qmk',
  authDomain: 'studio-189760261-c73e4.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '674456812406',
};

export const firebaseConfig: FirebaseOptions =
  envConfig.apiKey && envConfig.projectId ? envConfig : defaultConfig;
