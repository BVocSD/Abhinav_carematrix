 'use client';
 
 import { useEffect, useState } from 'react';
 import { useUser, useFirebase } from '@/firebase';
 import { useRouter } from 'next/navigation';
 import { doc, getDoc } from 'firebase/firestore';
 import { Loader2 } from 'lucide-react';
import { bookings, applications } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function AdminPage() {
   const router = useRouter();
   const { user, isUserLoading } = useUser();
   const { firestore } = useFirebase();
   const [checked, setChecked] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
 
   useEffect(() => {
     if (isUserLoading) return;
     if (!user) {
       setChecked(true);
       setIsAdmin(false);
       return;
     }
     getDoc(doc(firestore, 'users', user.uid))
       .then((snap) => {
         const admin = !!snap.data()?.isAdmin;
         setIsAdmin(admin);
         setChecked(true);
       })
       .catch(() => {
         setIsAdmin(false);
         setChecked(true);
       });
   }, [user, isUserLoading, firestore]);
 
   useEffect(() => {
     if (!isUserLoading && checked && !isAdmin) {
       router.replace('/admin/login');
     }
   }, [isUserLoading, checked, isAdmin, router]);
 
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': 
      case 'Hired':
        return 'default';
      case 'Pending':
      case 'In Review':
        return 'secondary';
      case 'Completed':
      case 'Received':
        return 'outline';
      case 'Cancelled':
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

   if (isUserLoading || !checked) {
     return (
       <div className="flex items-center justify-center h-[50vh]">
         <Loader2 className="h-6 w-6 animate-spin" />
       </div>
     );
   }
 
   if (!isAdmin) {
     return null;
   }
 
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage bookings and job applications.</p>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
          <TabsTrigger value="applications">Job Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Service Bookings</CardTitle>
              <CardDescription>Review and manage all client bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.userName}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>{format(booking.date, 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Review and manage all job applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.fullName}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm">View</Button>
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
