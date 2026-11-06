'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth, useFirebase } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AdminAuthFormProps {
  mode: 'login' | 'signup';
}

const ADMIN_INVITE_CODE = 'CAREMX-ADMIN';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  inviteCode: z.string().min(1, { message: 'Invite code is required.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.inviteCode === ADMIN_INVITE_CODE, {
  message: "Invalid admin invite code",
  path: ['inviteCode'],
});

export function AdminAuthForm({ mode }: AdminAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{ open: boolean; title: string; description: string; redirectTo?: string | null }>({ 
    open: false, 
    title: '', 
    description: '', 
    redirectTo: null 
  });
  const auth = useAuth();
  const { firestore } = useFirebase();

  const form = useForm<z.infer<typeof loginSchema | typeof signupSchema>>({
    resolver: zodResolver(mode === 'signup' ? signupSchema : loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        inviteCode: '',
        confirmPassword: '',
      }),
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof signupSchema>) {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { firstName, lastName, email, password, phoneNumber } = values as z.infer<typeof signupSchema>;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
          const userProfile = {
            id: user.uid,
            firstName,
            lastName,
            email,
            phoneNumber,
            isAdmin: true,
          };
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDocumentNonBlocking(userDocRef, userProfile, {});

          toast({
            title: 'Admin Account Created',
            description: 'Welcome! Your admin account has been created successfully.',
          });
          router.push('/admin');
        }
      } else {
        const { email, password } = values;
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        
        const ref = doc(firestore, 'users', user.uid);
        const snap = await getDoc(ref);
        
        if (!snap.exists() || !snap.data().isAdmin) {
          await signOut(auth);
          setDialogState({
            open: true,
            title: 'Admin Access Denied',
            description: 'This account does not have admin privileges.',
            redirectTo: '/admin/login',
          });
          return;
        }

        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting to admin dashboard.',
        });
        router.push('/admin');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error?.message || 'Something went wrong. Please try again.';

      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }

      setDialogState({
        open: true,
        title: `${mode === 'login' ? 'Login' : 'Signup'} Failed`,
        description: errorMessage,
        redirectTo: null,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const title = mode === 'login' ? 'Admin Login' : 'Admin Signup';
  const description = mode === 'login' 
    ? 'Enter your credentials to access the admin dashboard.' 
    : 'Create a new admin account with your invite code.';
  const buttonText = mode === 'login' ? 'Login' : 'Sign Up';
  const linkText = mode === 'login' ? "Don't have an admin account? Sign up" : 'Already have an admin account? Login';
  const linkHref = mode === 'login' ? '/admin/signup' : '/admin/login';

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@carematrix.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mode === 'signup' && (
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mode === 'signup' && (
                <>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inviteCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invite Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin invite code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href={linkHref} className="underline">
              {linkText}
            </Link>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={dialogState.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => {
              const dest = dialogState.redirectTo;
              setDialogState({ ...dialogState, open: false, redirectTo: null });
              if (dest) {
                router.push(dest);
              }
            }}
          >
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
