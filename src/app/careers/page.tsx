'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase';
import { useFirebaseApp } from '@/firebase/provider';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const applicationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  coverLetter: z.string().min(50, { message: 'Cover letter must be at least 50 characters.' }).max(2000),
});

export default function CareersPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const bannerImage = PlaceHolderImages.find((img) => img.id === 'careers-banner');
  const firestore = useFirestore();
  const { user } = useUser();
  const firebaseApp = useFirebaseApp();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
    },
  });

  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    setIsLoading(true);

    try {
      const payload = {
        userId: user?.uid ?? null,
        userEmail: user?.email ?? null,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        coverLetter: values.coverLetter,
        status: 'Received',
        createdAt: new Date(),
      };
      const colRef = collection(firestore, 'jobApplications');
      addDocumentNonBlocking(colRef, payload);
      toast({
        title: 'Application Submitted Successfully',
        description:
          'Thank you for your interest. Please have your resume ready, as our team will be in touch shortly to discuss the next steps.',
      });
      form.reset();
    } catch {
      toast({
        title: 'Submission Failed',
        description: 'Unable to submit your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
        <section className="relative h-64 w-full bg-primary/20">
            {bannerImage && (
            <Image
                src={bannerImage.imageUrl}
                alt={bannerImage.description}
                fill
                className="object-cover"
                data-ai-hint={bannerImage.imageHint}
            />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">Join Our Team</h1>
            <p className="mt-2 max-w-2xl text-lg">
                Make a difference in people's lives. Start your career with CareMatrix.
            </p>
            </div>
        </section>

        <div className="container mx-auto max-w-3xl px-4 py-16">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Apply Now</CardTitle>
                <CardDescription>
                Fill out the form below to apply for a caregiver position.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
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
                    </div>
                    <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cover Letter</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Tell us a little about yourself and why you're a good fit..."
                            className="min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Application
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        </div>
    </div>
  );
}
