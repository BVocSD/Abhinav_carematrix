import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Heart, Stethoscope, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Compassionate Care, Right at Home
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover trusted and professional home-care services tailored to your family's needs.
          </p>
          <Link href="/services" className="mt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Explore Our Services
            </Button>
          </Link>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            Our Services
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <Card key={service.id} className="flex flex-col overflow-hidden text-center transition-transform hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="pt-4 font-headline">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            Why Choose CareMatrix?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-headline text-xl font-semibold">Personalized Care</h3>
              <p className="text-muted-foreground">
                Customized care plans that respect your individual needs and preferences.
              </p>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-headline text-xl font-semibold">Trusted Professionals</h3>
              <p className="text-muted-foreground">
                Our caregivers are vetted, trained, and dedicated to providing the best service.
              </p>
            </div>
            <div className="text-center">
              <Stethoscope className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-headline text-xl font-semibold">Comprehensive Services</h3>
              <p className="text-muted-foreground">
                From daily assistance to specialized medical care, we've got you covered.
              </p>
            </div>
             <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-headline text-xl font-semibold">Quality & Safety</h3>
              <p className="text-muted-foreground">
                We adhere to the highest standards of safety and quality in all our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
            Join Our Team of Caregivers
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Are you passionate about making a difference? We're looking for dedicated individuals to join our team.
          </p>
          <Link href="/careers">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
