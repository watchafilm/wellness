
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParticipants, type Participant } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Trophy } from 'lucide-react';
import { pushupsBenchmarkTextData, calculatePushupsPoints, pointLevels } from '@/lib/benchmarks/pushups';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29", "30-39 ปี": "30-39", "40-49 ปี": "40-49",
    "50-59 ปี": "50-59", "60-69 ปี": "60-69", "70+ ปี": "70+",
};
const reverseAgeGroupMapping = Object.fromEntries(Object.entries(ageGroupMapping).map(([key, value]) => [value, key]));

function BenchmarkTable({ gender, highlightInfo }: { 
    gender: 'male' | 'female';
    highlightInfo: { ageRange: string; points: number; } | null;
}) {
    const ageGroups = Object.keys(pushupsBenchmarkTextData[gender]);
    const pointLevelsSorted = Object.entries(pointLevels).sort((a, b) => Number(b[0]) - Number(a[0]));

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center px-2">Points</TableHead>
                        <TableHead className="w-[100px] px-2">Level</TableHead>
                        {ageGroups.map(ageKey => (
                            <TableHead key={ageKey} className="text-center min-w-[80px] px-2 text-xs">{reverseAgeGroupMapping[ageKey]}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pointLevelsSorted.map(([points, level]) => {
                        const pointValue = Number(points);
                        return (
                            <TableRow key={points}>
                                <TableCell className="font-extrabold text-lg text-center px-2">{points}</TableCell>
                                <TableCell className="font-semibold px-2">{level}</TableCell>
                                {ageGroups.map(ageKey => {
                                    const isHighlighted = 
                                        highlightInfo &&
                                        ageGroupMapping[highlightInfo.ageRange] === ageKey &&
                                        highlightInfo.points === pointValue;

                                    const cellClasses = isHighlighted 
                                        ? 'bg-yellow-400/30 dark:bg-yellow-500/30 animate-rank-one-glow relative z-10' 
                                        : '';
                                    
                                    const benchmarksForAge = pushupsBenchmarkTextData[gender][ageKey as keyof typeof pushupsBenchmarkTextData['male']];
                                    const reps = benchmarksForAge[points as keyof typeof benchmarksForAge];

                                    return (
                                        <TableCell key={ageKey} className={cn("text-center font-mono px-2", cellClasses)}>
                                            {reps}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}


export default function PushupsStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participantId: string; points: number } | null>(null);
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
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
            setCurrentParticipant(null);
            setLastSubmission(null);
            return;
        }

        const points = calculatePushupsPoints(participant.gender, participant.ageRange, score);
        
        updateScore('pushups', participant.id, score);
        
        setCurrentParticipant(participant);
        setLastSubmission({ participantId: participant.id, points });

        setActiveTab(participant.gender);

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score} reps, earning ${points} points (${pointLevels[points] || 'N/A'}).`,
        });
        
        const form = e.currentTarget;
        const scoreInput = form.elements.namedItem('score') as HTMLInputElement;
        if (scoreInput) scoreInput.value = '';
        scoreInput?.focus();
    };
    
    return (
         <div className="container mx-auto flex flex-col items-center gap-8 py-8">
            <div className="w-full max-w-lg">
                <Card className="w-full shadow-lg border-none">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-accent/20 rounded-lg">
                                <Dumbbell className="h-8 w-8 text-accent" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-2xl">Push Ups Station</CardTitle>
                                <CardDescription>Enter participant score for this station.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="participantId-pushups">Participant ID</Label>
                                <Input id="participantId-pushups" name="participantId" placeholder="e.g., P001" required className="mt-1" autoComplete="off" />
                            </div>
                            <div>
                                <Label htmlFor="score-pushups">Score (reps)</Label>
                                <Input id="score-pushups" name="score" type="number" step="1" min="0" placeholder="Enter number of push-ups" required className="mt-1" />
                            </div>
                            <Button type="submit" className="w-full !mt-8 bg-primary text-primary-foreground hover:bg-primary/90">Submit Score</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <div className="w-full">
                <Card className="w-full shadow-lg border-none min-h-[500px]">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Trophy className="text-accent" /> Push-ups Benchmark
                        </CardTitle>
                        <CardDescription>
                            {currentParticipant && lastSubmission
                                ? `Highlighting score for ${currentParticipant.name} (Age: ${currentParticipant.ageRange})`
                                : "Submit a score to automatically display the relevant benchmark."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'male' | 'female')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="male">Male</TabsTrigger>
                                <TabsTrigger value="female">Female</TabsTrigger>
                            </TabsList>
                            <TabsContent value="male">
                                <BenchmarkTable 
                                    gender="male"
                                    highlightInfo={currentParticipant?.gender === 'male' && lastSubmission ? {
                                        ageRange: currentParticipant.ageRange,
                                        points: lastSubmission.points
                                    } : null}
                                />
                            </TabsContent>
                            <TabsContent value="female">
                                 <BenchmarkTable 
                                    gender="female"
                                    highlightInfo={currentParticipant?.gender === 'female' && lastSubmission ? {
                                        ageRange: currentParticipant.ageRange,
                                        points: lastSubmission.points
                                    } : null}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
