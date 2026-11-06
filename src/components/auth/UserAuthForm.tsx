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

interface UserAuthFormProps {
  mode: 'login' | 'signup';
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function UserAuthForm({ mode }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{ open: boolean; title: string; description: string; redirectTo?: string | null }>({ open: false, title: '', description: '', redirectTo: null });
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
        confirmPassword: '',
      }),
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof signupSchema>) {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { firstName, lastName, email, password, phoneNumber } = values as z.infer<typeof signupSchema>;

        // Create the account and sign the user in
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
          const userProfile = {
            id: user.uid,
            firstName,
            lastName,
            email,
            phoneNumber,
            isServiceProvider: false,
          };
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDocumentNonBlocking(userDocRef, userProfile, {});

          toast({
            title: 'Account Created',
            description: 'Welcome! Your account has been created successfully.',
          });
          router.push('/');
        }

      } else {
        const { email, password } = values;
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        const ref = doc(firestore, 'users', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await signOut(auth);
          setDialogState({
            open: true,
            title: 'Account Not Found',
            description: 'Please sign up before logging in.',
            redirectTo: '/signup',
          });
          return;
        }
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting you to the homepage.',
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error?.message || 'Something went wrong. Please try again.';

      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in instead.';
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

  const title = mode === 'login' ? 'Login' : 'Signup';
  const description = mode === 'login'
    ? 'Enter your credentials to access your account'
    : 'Fill in your details to create a new account';
  const buttonText = mode === 'login' ? 'Login' : 'Create Account';
  const linkText = mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login';
  const linkHref = mode === 'login' ? '/signup' : '/login';

  return (
    <>
      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <Input placeholder="name@example.com" {...field} />
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
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
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
