
"use client";

import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { stations, StationKey, type BadgeVariant } from '@/lib/stations';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from 'lucide-react';


// Import all calculation functions and level definitions
import { calculatePushupsPoints, pointLevels as pushupsPointLevels } from '@/lib/benchmarks/pushups';
import { calculateSitRisePoints } from '@/lib/benchmarks/sit_rise';
import { calculateSitReachResult } from '@/lib/benchmarks/sit_reach';
import { calculateOneLegResult } from '@/lib/benchmarks/one_leg';
import { calculateReactionResult } from '@/lib/benchmarks/reaction';
import { calculateWhRatioPointsFromRatio, pointLevels as whRatioPointLevels } from '@/lib/benchmarks/wh_ratio';
import { calculateGripPoints } from '@/lib/benchmarks/grip';

// A single source for point levels, they are consistent across files
const pointLevels = pushupsPointLevels;

const getPointsAndLevelForStation = (stationKey: StationKey, participant: Participant): { points: number; level: string } => {
    const score = participant.scores[stationKey];
    if (score === undefined || score === null) {
        return { points: 0, level: 'N/A' };
    }

    switch (stationKey) {
        case 'pushups': {
            const points = calculatePushupsPoints(participant.gender, participant.ageRange, score);
            return { points, level: pointLevels[points] || 'N/A' };
        }
        case 'sit_rise': {
            const points = calculateSitRisePoints(participant.gender, participant.ageRange, score);
            // Sit & Rise has a custom point mapping (1,3,4,5)
            const levelMap: { [key: number]: string } = { 5: 'Excellent', 4: 'Good', 3: 'Average', 1: 'Poor' };
            return { points, level: levelMap[points] || 'N/A' };
        }
        case 'sit_reach': {
            const { points, label } = calculateSitReachResult(participant.gender, participant.ageRange, score);
            return { points, level: label };
        }
        case 'one_leg': {
            const { points, label } = calculateOneLegResult(participant.gender, participant.ageRange, score);
            return { points, level: label };
        }
        case 'reaction': {
            const { points, label } = calculateReactionResult(participant.gender, participant.ageRange, score);
            return { points, level: label };
        }
        case 'wh_ratio': {
            const points = calculateWhRatioPointsFromRatio(participant.gender, score);
            return { points, level: whRatioPointLevels[points] || 'N/A' };
        }
        case 'grip': {
            const { points, label } = calculateGripPoints(participant.gender, participant.ageRange, score);
            return { points, level: label };
        }
        default:
            return { points: 0, level: 'N/A' };
    }
};

const levelToVariant: Record<string, BadgeVariant> = {
    'Excellent': 'default',
    'Healthy': 'default',
    'Good': 'secondary',
    'Acceptable': 'secondary',
    'Average': 'outline',
    'Below Avg': 'destructive',
    'Overweight': 'destructive',
    'High Risk': 'destructive',
    'Poor': 'destructive',
    'Very High Risk': 'destructive',
    'N/A': 'outline',
};


export default function AdminDashboardPage() {
  const { participants, loading } = useParticipants();

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const rankedParticipants = [...participants].map(p => {
    const stationResults = Object.keys(stations).reduce((acc, key) => {
        acc[key as StationKey] = getPointsAndLevelForStation(key as StationKey, p);
        return acc;
    }, {} as Record<StationKey, { points: number; level: string }>);

    const totalScore = Object.values(stationResults).reduce((sum, result) => sum + result.points, 0);
    
    return {
      ...p,
      totalScore,
      stationResults,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <TooltipProvider>
      <Card className="shadow-2xl border-none bg-card/90 backdrop-blur-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-headline text-3xl text-primary">Scoreboard</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
          ตารางคะแนนรวมของผู้เข้าร่วมกิจกรรมทั้งหมด (คำนวณจาก Point ที่ได้ในแต่ละฐาน)
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-6 pt-0">
          <Table className="w-[90%] mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center font-bold px-2 py-3">อันดับ</TableHead>
                <TableHead className="px-2 py-3">ชื่อ</TableHead>
                {Object.values(stations).map(s => <TableHead key={s.name} className="text-center px-1 py-3 text-xs">{s.name}</TableHead>)}
                <TableHead className="text-center font-bold px-2 py-3">คะแนนรวม</TableHead>
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
                    <TableCell className="text-center font-extrabold text-2xl text-primary px-2 py-4">{rank}</TableCell>
                    <TableCell className="font-medium px-2 py-4">
                      {p.name}
                      <br/>
                      <span className="text-xs text-muted-foreground font-mono">{p.id}</span>
                    </TableCell>
                    {Object.entries(p.stationResults).map(([key, result]) => {
                      const score = p.scores[key as StationKey];
                      const displayScore = (key === 'wh_ratio' || key === 'reaction') && typeof score === 'number'
                          ? score.toFixed(3)
                          : (typeof score === 'number' ? score.toFixed(0) : 'N/A');
                      const unit = stations[key as StationKey]?.unit ?? '';

                      return (
                        <TableCell key={key} className="text-center px-1 py-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                  <div className="font-semibold text-lg cursor-default">{result.points} <span className="text-xs text-muted-foreground">pts</span></div>
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>Score: {displayScore} {unit}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Badge variant={levelToVariant[result.level]} className="mt-1 text-xs font-normal">{result.level}</Badge>
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-center font-bold text-lg px-2 py-4">{p.totalScore}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
