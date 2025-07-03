
"use client";

import { useState, useMemo } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Timer } from 'lucide-react';
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

const CustomChartLabel = ({ cx, cy, payload }: any) => {
    if (!payload || !payload.name) return null;
    const { name, points, level, time } = payload;

    return (
        <g transform={`translate(${cx},${cy})`}>
            {/* Position the label to the right and slightly above the dot */}
            <foreignObject x={15} y={-50} width={130} height={70}>
                <div
                    className="w-full h-full flex items-center"
                    xmlns="http://www.w3.org/1999/xhtml"
                >
                    <div className="p-2 bg-card/90 backdrop-blur-sm border rounded-lg shadow-lg text-left w-full">
                        <p className="font-bold text-sm text-primary whitespace-nowrap truncate">{name}</p>
                        <p className="font-semibold text-lg leading-tight">
                            {points} <span className="text-xs font-medium">pts</span>
                            <span className="text-xs text-muted-foreground font-normal ml-1">({level})</span>
                        </p>
                        <p className="text-xs text-muted-foreground -mt-1">
                            {time.toFixed(0)} ms
                        </p>
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};


export default function ReactionStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participant: Participant; score: number; result: { points: number; label: string; } } | null>(null);

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
        
        const result = calculateReactionResult(participant.gender, participant.ageRange, score);

        updateScore('reaction', participant.id, score);
        const updatedParticipant = { ...participant, scores: { ...participant.scores, reaction: score } };
        setLastSubmission({ participant: updatedParticipant, score, result });

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score}s, earning ${result.points} points (${result.label}).`,
        });
        
        form.reset();
        const pIdInput = form.elements.namedItem('participantId') as HTMLInputElement;
        pIdInput?.focus();
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
                                ? `Highlighting: ${lastSubmission.participant.name} scored ${lastSubmission.result.points} points (${lastSubmission.result.label}).`
                                : "Visualizing participant reaction time. Enter a score to see the point on the chart."}
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
                        <ComposedChart margin={{ top: 60, right: 20, left: 10, bottom: 20 }}>
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
                            
                            {/* This scatter plot only shows the most recent submission */}
                            {highlightedPoint && (
                                <Scatter
                                    dataKey="time"
                                    data={[highlightedPoint]}
                                    fill="hsl(var(--accent))"
                                    shape={<PulsingDot />}
                                    isAnimationActive={false}
                                    label={<CustomChartLabel />}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
