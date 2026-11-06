 'use client';
 
 import { AdminAuthForm } from '@/components/auth/AdminAuthForm';
 
 export default function AdminLoginPage() {
   return (
     <div className="container mx-auto px-4 py-16 flex justify-center">
       <AdminAuthForm mode="login" />
     </div>
   );
 }
