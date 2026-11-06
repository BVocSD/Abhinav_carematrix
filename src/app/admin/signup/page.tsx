 'use client';
 
 import { AdminAuthForm } from '@/components/auth/AdminAuthForm';
 
 export default function AdminSignupPage() {
   return (
     <div className="container mx-auto px-4 py-16 flex justify-center">
       <AdminAuthForm mode="signup" />
     </div>
   );
 }
