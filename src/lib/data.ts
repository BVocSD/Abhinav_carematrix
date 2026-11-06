import {
  HeartHandshake,
  Stethoscope,
  CookingPot,
  Sparkles,
  Car,
  Pill,
  Users,
  Activity,
  PersonStanding,
} from 'lucide-react';
import type { Service, Booking, JobApplication, Caregiver } from './types';

export const caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    name: 'Sarah Jenkins',
    role: 'Certified Nursing Assistant',
    experience: '5 years',
    bios: {
      'personal-care': 'Compassionate CNA with a focus on elderly care, ensuring dignity and comfort during daily activities.',
      'meal-preparation': 'Loves cooking nutritious and delicious meals, catering to specific dietary needs like low-sodium or diabetic-friendly diets.',
      'light-housekeeping': 'Detailed-oriented and efficient in maintaining a clean and organized living space for peace of mind.',
      'companionship': 'Warm and friendly, always ready for a chat, a card game, or a walk to keep clients socially engaged.',
      'mobility-support': 'Patient and encouraging, helping clients move safely around the home while building confidence and preventing falls.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
    serviceIds: ['personal-care', 'meal-preparation', 'light-housekeeping', 'companionship', 'mobility-support'],
    rating: 4.8,
  },
  {
    id: 'cg-2',
    name: 'Robert Wilson',
    role: 'Registered Nurse',
    experience: '8 years',
    bios: {
      'skilled-nursing': 'Specialized in post-surgery recovery, wound care, and complex medication management with a gentle touch.',
      'medication-reminders': 'Diligent and punctual, ensuring you never miss a dose and understanding the importance of adherence.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
    serviceIds: ['skilled-nursing', 'medication-reminders'],
    rating: 4.9,
  },
  {
    id: 'cg-3',
    name: 'Maria Garcia',
    role: 'Home Health Aide',
    experience: '3 years',
    bios: {
      'meal-preparation': 'Passionate about creating home-cooked meals that bring joy and nutrition to the table.',
      'light-housekeeping': 'Takes pride in creating a tidy and welcoming home environment.',
      'transportation': 'Safe and reliable driver with a clean record, enjoying conversations during rides to appointments or outings.',
      'companionship': 'Cheerful and attentive, brightening each day with conversation, hobbies, and genuine company.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop',
    serviceIds: ['meal-preparation', 'light-housekeeping', 'transportation', 'companionship'],
    rating: 4.7,
  },
  {
    id: 'cg-4',
    name: 'David Chen',
    role: 'Physical Therapy Assistant',
    experience: '6 years',
    bios: {
      'personal-care': 'Strong and supportive, assisting with mobility and transfers to ensure safety and confidence.',
      'transportation': 'Punctual and courteous, providing comfortable transport for all your mobility needs.',
      'physiotherapy': 'Skilled in guided rehabilitation exercises, helping clients rebuild strength, balance, and range of motion after injury or surgery.',
      'mobility-support': 'Expert at safe transfers and walking assistance, tailoring each session to the client’s ability and goals.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop',
    serviceIds: ['personal-care', 'transportation', 'physiotherapy', 'mobility-support'],
    rating: 4.9,
  },
  {
    id: 'cg-5',
    name: 'Emily Carter',
    role: 'Licensed Physiotherapist',
    experience: '7 years',
    bios: {
      'physiotherapy': 'Certified physiotherapist designing personalised exercise plans to restore mobility and reduce pain for a range of conditions.',
      'mobility-support': 'Focuses on balance training and fall prevention, gently guiding clients toward safe, independent movement.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop',
    serviceIds: ['physiotherapy', 'mobility-support'],
    rating: 4.9,
  },
];

export const services: Service[] = [
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Assistance with daily activities like bathing, dressing, and grooming.',
    longDescription: 'Our personal care services are designed to help individuals maintain their independence and dignity. We provide respectful assistance with daily living activities, including bathing, dressing, grooming, and mobility support, all in the comfort of their own home.',
    price: 'Rs 150/hour',
    icon: HeartHandshake,
  },
  {
    id: 'skilled-nursing',
    name: 'Skilled Nursing',
    description: 'Medical care provided by registered nurses, including wound care and medication management.',
    longDescription: 'For clients with medical needs, our skilled nursing services offer professional care from registered nurses. This includes medication administration, wound care, chronic disease management, and post-surgery care, ensuring top-tier medical support at home.',
    price: 'Rs 200/hour',
    icon: Stethoscope,
  },
  {
    id: 'meal-preparation',
    name: 'Meal Preparation',
    description: 'Planning and cooking nutritious meals tailored to dietary needs.',
    longDescription: 'Proper nutrition is vital. Our caregivers can plan and prepare delicious, healthy meals that cater to specific dietary requirements and preferences, from diabetic-friendly diets to low-sodium options, ensuring our clients eat well every day.',
    price: 'Rs 150/hour',
    icon: CookingPot,
  },
  {
    id: 'light-housekeeping',
    name: 'Light Housekeeping',
    description: 'Keeping the home tidy with tasks like dusting, vacuuming, and laundry.',
    longDescription: 'A clean and organized environment contributes to well-being. Our light housekeeping services include tasks like dusting, vacuuming, laundry, and changing linens to maintain a safe and comfortable living space for our clients.',
    price: 'Rs 180/hour',
    icon: Sparkles,
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Reliable transport to appointments, social events, and errands.',
    longDescription: 'We help clients stay active and connected in their community by providing safe and reliable transportation to medical appointments, grocery shopping, social outings, and other essential errands.',
    price: 'Rs 180/hour',
    icon: Car,
  },
  {
    id: 'medication-reminders',
    name: 'Medication Reminders',
    description: 'Ensuring medications are taken on time and as prescribed.',
    longDescription: 'Adhering to a medication schedule is crucial. Our caregivers provide timely reminders to ensure that medications are taken correctly and as prescribed by a doctor, helping to manage health conditions effectively.',
    price: 'Rs 100/hour',
    icon: Pill,
  },
  {
    id: 'companionship',
    name: 'Companionship',
    description: 'Friendly company and social interaction to reduce loneliness.',
    longDescription: 'Social connection is essential for emotional well-being. Our companionship services offer friendly conversation, shared hobbies, games, and walks, helping clients stay engaged, stimulated, and connected to the world around them.',
    price: 'Rs 120/hour',
    icon: Users,
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    description: 'Guided exercises and therapy to improve strength and movement.',
    longDescription: 'Our physiotherapy services help clients recover from injury, surgery, or illness and manage chronic conditions. Trained therapists guide gentle exercises, stretching, and rehabilitation routines to improve strength, balance, and mobility in the comfort of home.',
    price: 'Rs 160/hour',
    icon: Activity,
  },
  {
    id: 'mobility-support',
    name: 'Mobility Support',
    description: 'Safe assistance with walking, transfers, and fall prevention.',
    longDescription: 'Maintaining mobility safely is key to independence. Our caregivers assist with walking, transfers, and exercises while focusing on fall prevention, helping clients move confidently and comfortably within their home.',
    price: 'Rs 150/hour',
    icon: PersonStanding,
  },
];

export const bookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-123',
    userName: 'Alice Johnson',
    serviceId: 'personal-care',
    serviceName: 'Personal Care',
    date: new Date('2024-08-15'),
    duration: 'daily',
    status: 'Confirmed'
  },
  {
    id: 'booking-2',
    userId: 'user-123',
    userName: 'Alice Johnson',
    serviceId: 'meal-preparation',
    serviceName: 'Meal Preparation',
    date: new Date('2024-08-16'),
    duration: 'daily',
    status: 'Pending'
  },
  {
    id: 'booking-3',
    userId: 'user-456',
    userName: 'Bob Williams',
    serviceId: 'skilled-nursing',
    serviceName: 'Skilled Nursing',
    date: new Date('2024-09-01'),
    duration: 'monthly',
    status: 'Completed'
  },
  {
    id: 'booking-4',
    userId: 'user-789',
    userName: 'Charlie Brown',
    serviceId: 'transportation',
    serviceName: 'Transportation',
    date: new Date('2024-08-20'),
    duration: 'daily',
    status: 'Cancelled'
  },
];


export const applications: JobApplication[] = [
  {
    id: 'app-1',
    fullName: 'Emily White',
    email: 'emily.white@example.com',
    phone: '555-0101',
    coverLetter: 'Passionate and experienced caregiver with over 5 years in the field...',
    resumeUrl: '/resumes/emily-white.pdf',
    status: 'Received',
  },
  {
    id: 'app-2',
    fullName: 'David Green',
    email: 'david.green@example.com',
    phone: '555-0102',
    coverLetter: 'A registered nurse with a specialization in geriatric care, seeking to...',
    resumeUrl: '/resumes/david-green.pdf',
    status: 'In Review',
  },
  {
    id: 'app-3',
    fullName: 'Sarah Black',
    email: 'sarah.black@example.com',
    phone: '555-0103',
    coverLetter: 'Recent graduate from a nursing program, eager to apply my skills...',
    resumeUrl: '/resumes/sarah-black.pdf',
    status: 'Interviewing',
  },
];
