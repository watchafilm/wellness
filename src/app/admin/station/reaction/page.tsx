
"use client";

import { useState, useMemo } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Timer, Loader2 } from 'lucide-react';
import { reactionTrendData, calculateReactionResult } from '@/lib/benchmarks/reaction';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ParticipantSearch } from '@/components/admin/ParticipantSearch';

const ageRangeToMidpoint = (ageRange: string): number => {
    if (ageRange.includes('+')) {
        return parseInt(ageRange, 10) + 2.5; // "70+ ปี" -> 72.5
    }
    const [min, max] = ageRange.replace(' ปี', '').split('-').map(Number);
    return (min + max) / 2;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data.id) { // This is a participant data point
            return (
                <div className="p-2 bg-background/80 border rounded-md shadow-lg">
                    <p className="font-bold">{data.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {data.id}</p>
                    <p className="text-sm">Age: {data.age.toFixed(1)} yrs</p>
                    <p className="text-sm">Time: {data.time.toFixed(0)} ms</p>
                </div>
            );
        }
    }
    return null;
};

// A custom dot for the scatter chart with a pulsing animation
const PulsingDot = (props: any) => {
  const { cx, cy, fill } = props;
  if (isNaN(cx) || isNaN(cy)) { return null; }
  return (
    // We use a group to apply the animation, so it doesn't get overwritten by recharts props
    <g>
      <circle cx={cx} cy={cy} r={8} fill={fill} stroke="white" strokeWidth={2}>
        <animate attributeName="r" from="8" to="12" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
};

export default function ReactionStationPage() {
    const { participants, updateScore, loading } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participant: Participant; score: number; result: { points: number; label: string; } } | null>(null);
    
    const [selectedParticipantId, setSelectedParticipantId] = useState('');
    const [score, setScore] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const participantId = selectedParticipantId.toUpperCase().trim();
        
        if (!participantId || score === '') {
            toast({ variant: "destructive", title: "Error", description: "Participant and score are required." });
            return;
        }

        const scoreValue = Number(score);
        const participant = participants.find(p => p.id.toUpperCase() === participantId);

        if (!participant) {
            toast({ variant: "destructive", title: "Error", description: `Participant ID "${participantId}" not found.` });
            setLastSubmission(null);
            return;
        }
        
        const result = calculateReactionResult(participant.gender, participant.ageRange, scoreValue);

        updateScore('reaction', participant.id, scoreValue);
        const updatedParticipant = { ...participant, scores: { ...participant.scores, reaction: scoreValue } };
        setLastSubmission({ participant: updatedParticipant, score: scoreValue, result });

        setSelectedParticipantId('');
        setScore('');
    };

    const highlightedPoint = useMemo(() => {
        if (!lastSubmission) return null;
        return {
            age: ageRangeToMidpoint(lastSubmission.participant.ageRange),
            time: lastSubmission.score * 1000,
            name: lastSubmission.participant.name,
            id: lastSubmission.participant.id,
            points: lastSubmission.result.points,
            level: lastSubmission.result.label,
        };
    }, [lastSubmission]);
    
    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center pt-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="w-full shadow-lg border-none">
                <CardHeader className="flex flex-col gap-4 p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 w-full">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-2xl flex items-center gap-3">
                                <Timer className="h-8 w-8 text-primary" />
                                Reaction Time vs. Age
                            </CardTitle>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="w-full md:max-w-[220px] space-y-2">
                           <ParticipantSearch 
                                participants={participants}
                                value={selectedParticipantId}
                                onSelect={(id) => {
                                    setSelectedParticipantId(id);
                                    setLastSubmission(null);
                                }}
                            />
                            <Input 
                                name="score" 
                                type="number" 
                                step="0.001" 
                                min="0" 
                                placeholder="Score (s)" 
                                required 
                                className="h-9"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            />
                            <Button type="submit" className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
                        </form>
                    </div>

                    <div className="flex justify-center items-center h-24 text-center">
                        {lastSubmission ? (
                            <div key={lastSubmission.participant.id} className="transition-all duration-500 animate-pop-in">
                                <p className="text-sm text-muted-foreground">
                                    Result for <span className="font-semibold text-foreground">{lastSubmission.participant.name}</span>:
                                </p>
                                <div className="flex items-baseline justify-center gap-x-4 mt-2">
                                    <p className="text-5xl font-bold text-primary">{lastSubmission.result.points} <span className="text-xl font-medium">Points</span></p>
                                    <p className="text-3xl font-semibold text-accent">{lastSubmission.result.label}</p>
                                </div>
                            </div>
                        ) : (
                            <CardDescription className="pt-8">
                                Visualizing participant reaction time. Enter a score to see the point on the chart.
                            </CardDescription>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                type="number" 
                                dataKey="age"
                                name="Age" 
                                domain={[15, 85]}
                                ticks={[20, 30, 40, 50, 60, 70, 80]}
                                label={{ value: "Age (Years)", position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis 
                                type="number"
                                name="Reaction Time" 
                                domain={[250, 550]}
                                label={{ value: 'Reaction Time (ms)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Legend verticalAlign="top" align="right" />
                            
                            <Line data={reactionTrendData} type="monotone" dataKey="male" stroke="#3b82f6" strokeWidth={3} dot={false} name="Male (Average)" activeDot={false} />
                            <Line data={reactionTrendData} type="monotone" dataKey="female" stroke="#ec4899" strokeWidth={3} dot={false} name="Female (Average)" activeDot={false} />
                            
                            {highlightedPoint && (
                                <ReferenceLine y={highlightedPoint.time} stroke="hsl(var(--accent))" strokeDasharray="4 4" isFront>
                                     <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" repeatCount="1" />
                                </ReferenceLine>
                            )}
                             {highlightedPoint && (
                                <ReferenceLine x={highlightedPoint.age} stroke="hsl(var(--accent))" strokeDasharray="4 4" isFront>
                                    <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" repeatCount="1" />
                                </ReferenceLine>
                            )}

                            {highlightedPoint && (
                                <Scatter
                                    name="Last score"
                                    dataKey="time"
                                    data={[highlightedPoint]}
                                    fill="hsl(var(--accent))"
                                    shape={<PulsingDot />}
                                    isAnimationActive={false}
                                    zIndex={100}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
