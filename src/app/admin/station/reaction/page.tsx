"use client";

import { useState, useMemo } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Timer } from 'lucide-react';
import { reactionTrendData } from '@/lib/benchmarks/reaction';
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
  ReferenceDot,
} from 'recharts';

const ageRangeToMidpoint = (ageRange: string): number => {
    if (ageRange.includes('+')) {
        return parseInt(ageRange, 10) + 2.5; // "70+ ปี" -> 72.5
    }
    const [min, max] = ageRange.replace(' ปี', '').split('-').map(Number);
    return (min + max) / 2;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        // payload can come from Scatter or Line, handle both
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

export default function ReactionStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participant: Participant; score: number } | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const participantId = (formData.get('participantId') as string)?.toUpperCase().trim();
        const scoreValue = formData.get('score');
        
        if (!participantId || scoreValue === null) {
            toast({ variant: "destructive", title: "Error", description: "Participant ID and score are required." });
            return;
        }

        const score = Number(scoreValue);
        const participant = participants.find(p => p.id.toUpperCase() === participantId);

        if (!participant) {
            toast({ variant: "destructive", title: "Error", description: `Participant ID "${participantId}" not found.` });
            setLastSubmission(null);
            return;
        }

        updateScore('reaction', participant.id, score);
        const updatedParticipant = { ...participant, scores: { ...participant.scores, reaction: score } };
        setLastSubmission({ participant: updatedParticipant, score });

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score}s.`,
        });
        
        form.reset();
        const pIdInput = form.elements.namedItem('participantId') as HTMLInputElement;
        pIdInput?.focus();
    };

    const chartData = useMemo(() => {
        const maleData = participants
            .filter(p => p.gender === 'male' && p.scores.reaction !== undefined)
            .map(p => ({
                age: ageRangeToMidpoint(p.ageRange),
                time: p.scores.reaction! * 1000,
                name: p.name,
                id: p.id,
            }));

        const femaleData = participants
            .filter(p => p.gender === 'female' && p.scores.reaction !== undefined)
            .map(p => ({
                age: ageRangeToMidpoint(p.ageRange),
                time: p.scores.reaction! * 1000,
                name: p.name,
                id: p.id,
            }));
        
        return { maleData, femaleData };
    }, [participants]);

    const highlightedPoint = useMemo(() => {
        if (!lastSubmission) return null;
        return {
            age: ageRangeToMidpoint(lastSubmission.participant.ageRange),
            time: lastSubmission.score * 1000,
            name: lastSubmission.participant.name,
        };
    }, [lastSubmission]);

    return (
        <div className="container mx-auto py-8">
            <Card className="w-full shadow-lg border-none">
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 sm:p-6">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl flex items-center gap-3">
                            <Timer className="h-8 w-8 text-primary" />
                            Reaction Time vs. Age
                        </CardTitle>
                        <CardDescription className="mt-2">
                           {lastSubmission
                                ? `Highlighting result for ${lastSubmission.participant.name}.`
                                : "Visualizing all participant reaction times."}
                        </CardDescription>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-[220px] space-y-2">
                        <Input 
                            name="participantId" 
                            placeholder="Participant ID" 
                            required 
                            autoComplete="off" 
                            className="h-9"
                            onChange={() => setLastSubmission(null)}
                        />
                        <Input name="score" type="number" step="0.001" min="0" placeholder="Score (s)" required className="h-9"/>
                        <Button type="submit" className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
                    </form>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
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
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" align="right" />
                            
                            <Line data={reactionTrendData} type="monotone" dataKey="male" stroke="#3b82f6" strokeWidth={3} dot={false} name="Male (Average)" activeDot={false} />
                            <Line data={reactionTrendData} type="monotone" dataKey="female" stroke="#ec4899" strokeWidth={3} dot={false} name="Female (Average)" activeDot={false} />
                            
                            <Scatter name="Male" data={chartData.maleData} dataKey="time" fill="#3b82f6" fillOpacity={0.6} />
                            <Scatter name="Female" data={chartData.femaleData} dataKey="time" fill="#ec4899" fillOpacity={0.6} />
                            
                            {highlightedPoint && (
                                <ReferenceDot 
                                    x={highlightedPoint.age} 
                                    y={highlightedPoint.time} 
                                    r={8} 
                                    fill="hsl(var(--accent))" 
                                    stroke="white" 
                                    strokeWidth={2}
                                    ifOverflow="extendDomain" >
                                    <animate attributeName="r" from="8" to="12" dur="1s" repeatCount="indefinite" />
                                </ReferenceDot>
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
