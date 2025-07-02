
"use client";

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLevel, mockParticipantsData, stations } from '@/lib/stations';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [participants] = useState(mockParticipantsData);

  const rankedParticipants = [...participants].map(p => ({
    ...p,
    totalScore: Object.values(p.scores).reduce((sum, score) => sum + score, 0)
  })).sort((a, b) => b.totalScore - a.totalScore);

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
              <TableHead className="w-[80px] text-center font-bold">อันดับ</TableHead>
              <TableHead>ชื่อ</TableHead>
              {Object.values(stations).map(s => <TableHead key={s.name} className="text-center">{s.name}</TableHead>)}
              <TableHead className="text-center font-bold">คะแนนรวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedParticipants.map((p, index) => {
               const rank = index + 1;
               const rankClasses = {
                   1: 'bg-yellow-400/30 dark:bg-yellow-500/30 animate-rank-one-glow relative z-10', // Gold
                   2: 'bg-slate-300/50 dark:bg-slate-600/50', // Silver
                   3: 'bg-orange-400/30 dark:bg-orange-600/40', // Bronze
               }[rank] || '';

              return (
                <TableRow key={p.id} className={cn("transition-colors", rankClasses)}>
                  <TableCell className="text-center font-extrabold text-2xl text-primary">{rank}</TableCell>
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
                  <TableCell className="text-center font-bold text-lg">{p.totalScore.toFixed(2)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
