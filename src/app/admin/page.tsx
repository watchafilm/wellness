
"use client";

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLevel, mockParticipantsData, stations } from '@/lib/stations';

export default function AdminDashboardPage() {
  const [participants] = useState(mockParticipantsData);

  // Sort participants by a total score (example: sum of all scores) for leaderboard ranking
  const rankedParticipants = [...participants].sort((a, b) => {
    const scoreA = Object.values(a.scores).reduce((sum, score) => sum + score, 0);
    const scoreB = Object.values(b.scores).reduce((sum, score) => sum + score, 0);
    return scoreB - scoreA; // Descending order
  });

  return (
    <Card className="shadow-2xl border-none bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-4xl text-primary">Scoreboard</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Live leaderboard for the Elite Athlete Fitness Challenge.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center font-bold">Rank</TableHead>
              <TableHead>Name</TableHead>
              {Object.values(stations).map(s => <TableHead key={s.name} className="text-center">{s.name}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedParticipants.map((p, index) => (
              <TableRow key={p.id} className="hover:bg-primary/5">
                <TableCell className="text-center font-bold text-xl text-primary">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {p.name}
                  <br/>
                  <span className="text-xs text-muted-foreground font-mono">{p.id}</span>
                </TableCell>
                {Object.entries(stations).map(([key, config]) => {
                   const score = p.scores[key as keyof typeof p.scores];
                   const level = getLevel(score, config.benchmarks.good, config.benchmarks.excellent, config.benchmarks.lowerIsBetter);
                   return (
                     <TableCell key={key} className="text-center">
                        <div className="font-semibold text-base">{score}</div>
                        <Badge variant={level.variant} className="mt-1 text-xs font-normal">{level.text}</Badge>
                     </TableCell>
                   )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
