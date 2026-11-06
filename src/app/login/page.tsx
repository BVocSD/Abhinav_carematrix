import { UserAuthForm } from '@/components/auth/UserAuthForm';
import { Stethoscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">CareMatrix</h1>
          <p className="text-muted-foreground mt-2">Please sign in to access our services</p>
        </div>
        <UserAuthForm mode="login" />
      </div>
    </div>
  );
}
