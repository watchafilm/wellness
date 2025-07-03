
"use client";

import { useParticipants } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ParticipantsPage() {
  const { participants } = useParticipants();

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Participants List</CardTitle>
        <CardDescription>A list of all registered participants in the event.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age Range</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono">{p.id}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.ageRange}</TableCell>
                <TableCell className="capitalize">{p.gender}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
