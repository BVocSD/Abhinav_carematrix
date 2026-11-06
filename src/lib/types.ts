import type { LucideIcon } from 'lucide-react';

export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  icon: LucideIcon;
};

export type Booking = {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  duration: 'daily' | 'monthly';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
};

export type JobApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string; // In a real app, this would be a file path/URL
  status: 'Received' | 'In Review' | 'Interviewing' | 'Rejected' | 'Hired';
};

export type Caregiver = {
  id: string;
  name: string;
  role: string;
  experience: string;
  bios: Record<string, string>; // Map serviceId to bio
  imageUrl: string;
  serviceIds: string[]; // Services this caregiver can perform
  rating: number;
};
