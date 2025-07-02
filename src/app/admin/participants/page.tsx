
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockParticipantsData } from '@/lib/stations';

export default function ParticipantsPage() {
  const [participants] = useState(mockParticipantsData);

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
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Total Score (Example)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono">{p.id}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell className="text-right font-medium">
                  {Object.values(p.scores).reduce((a, b) => a + b, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
