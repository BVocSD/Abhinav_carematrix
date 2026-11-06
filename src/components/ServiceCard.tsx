 'use client';
 
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Service, Caregiver } from '@/lib/types';
import { caregivers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, ArrowLeft } from 'lucide-react';
import { useAuth, useFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'caregiver-selection' | 'booking-details'>('caregiver-selection');
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState<'daily' | 'monthly'>('daily');
  const [preferredTime, setPreferredTime] = useState<string>('Morning');
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const { firestore } = useFirebase();

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const availableCaregivers = caregivers.filter((c) => c.serviceIds.includes(service.id));

  const handleCaregiverSelect = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setStep('booking-details');
  };

  const handleBack = () => {
    setStep('caregiver-selection');
    setSelectedCaregiver(null);
  };

  const handleBooking = async () => {
    if (!bookingDate) {
      toast({
        title: 'Error',
        description: 'Please select a date for your service.',
        variant: 'destructive',
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to book a service.',
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);
    try {
      // Get user profile to include phone number
      const userDocRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : null;

      const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        userPhone: userData?.phoneNumber || 'N/A',
        userName: userData ? `${userData.firstName} ${userData.lastName}` : user.displayName || 'User',
        serviceId: service.id,
        serviceName: service.name,
        caregiverId: selectedCaregiver?.id || 'none',
        caregiverName: selectedCaregiver?.name || 'Any Available',
        bookingDate: bookingDate,
        duration: duration,
        preferredTime: preferredTime,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'bookings'), bookingData);

      toast({
        title: 'Booking Confirmed!',
        description: `Your ${service.name} service has been recorded. Our team will contact you shortly to confirm.`,
      });

      setOpen(false);
      // Reset state after closing
      setTimeout(() => {
        setStep('caregiver-selection');
        setSelectedCaregiver(null);
      }, 300);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col overflow-hidden text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <service.icon className="h-10 w-10" />
          </div>
          <CardTitle className="pt-4 font-headline text-xl">{service.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">{service.description}</p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="font-bold text-primary">{service.price}</p>
          <Button onClick={() => setOpen(true)} className="w-full">Book Now</Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {step === 'caregiver-selection' ? `Select a Caregiver for ${service.name}` : `Book ${selectedCaregiver?.name}`}
            </DialogTitle>
            <DialogDescription>
              {step === 'caregiver-selection'
                ? 'Choose a professional caregiver that fits your needs.'
                : 'Complete your booking details below.'}
            </DialogDescription>
          </DialogHeader>

          {step === 'caregiver-selection' ? (
            <div className="grid gap-4 py-4 md:grid-cols-2">
              {availableCaregivers.length > 0 ? (
                availableCaregivers.map((caregiver) => (
                  <div
                    key={caregiver.id}
                    className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 hover:border-primary"
                    onClick={() => handleCaregiverSelect(caregiver)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={caregiver.imageUrl} alt={caregiver.name} />
                        <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <h4 className="font-semibold">{caregiver.name}</h4>
                        <p className="text-xs text-muted-foreground">{caregiver.role}</p>
                        <div className="mt-1 flex items-center text-xs text-yellow-500">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          {caregiver.rating} ({caregiver.experience})
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                      {caregiver.bios[service.id]}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  No specific caregivers listed for this service yet.
                  <Button variant="link" onClick={() => setStep('booking-details')}>Skip to booking</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              {selectedCaregiver && (
                <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 border border-primary/20">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={selectedCaregiver.imageUrl} alt={selectedCaregiver.name} />
                    <AvatarFallback>{selectedCaregiver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h4 className="font-semibold text-lg">{selectedCaregiver.name}</h4>
                    <p className="text-sm text-primary font-medium">{selectedCaregiver.role}</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">"{selectedCaregiver.bios[service.id]}"</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6 py-4">
                <div className="flex-1">
                  <Label className="mb-2 block font-medium text-sm">Select Date</Label>
                  <div className="rounded-xl border bg-card p-3 shadow-md inline-block">
                    <Calendar
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      disabled={(date) => date < startOfToday}
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <Label className="mb-2 block font-medium text-sm">Booking Duration</Label>
                    <RadioGroup defaultValue="daily" value={duration} onValueChange={(value: 'daily' | 'monthly') => setDuration(value)} className="grid grid-cols-2 gap-3">
                      <div className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg border transition-all hover:bg-accent cursor-pointer ${duration === 'daily' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                        <RadioGroupItem value="daily" id="daily" className="sr-only" />
                        <Label htmlFor="daily" className="cursor-pointer text-xs font-semibold">Daily</Label>
                        <span className="text-[10px] text-muted-foreground">Every day</span>
                      </div>
                      <div className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg border transition-all hover:bg-accent cursor-pointer ${duration === 'monthly' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                        <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                        <Label htmlFor="monthly" className="cursor-pointer text-xs font-semibold">Monthly</Label>
                        <span className="text-[10px] text-muted-foreground">Every month</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="mb-2 block font-medium text-sm">Preferred Time</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Morning', 'Afternoon', 'Evening'].map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={preferredTime === time ? 'default' : 'outline'}
                          className={`text-xs h-8 px-2 transition-all ${
                            preferredTime === time 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'hover:border-primary hover:text-primary'
                          }`}
                          onClick={() => setPreferredTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {step === 'booking-details' && (
              <Button variant="outline" onClick={handleBack} className="mr-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            {step === 'booking-details' && (
              <Button onClick={handleBooking} disabled={isBooking}>
                {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            )}
            {/* If no caregivers, allow skipping from selection screen (handled by link above, but maybe a button here too?) */}
            {step === 'caregiver-selection' && availableCaregivers.length === 0 && (
              <Button onClick={() => setStep('booking-details')}>
                Continue to Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
