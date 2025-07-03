
"use client";

import { useState } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { PersonStanding } from 'lucide-react';
import { sitRiseBenchmarkTextData, calculateSitRisePoints, pointLevels } from '@/lib/benchmarks/sit_rise';
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
    const ageGroups = Object.keys(sitRiseBenchmarkTextData[gender]);
    const pointLevelsSorted = Object.entries(pointLevels).sort((a, b) => Number(b[0]) - Number(a[0]));

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center px-2 text-base">Points</TableHead>
                        <TableHead className="w-[100px] px-2 text-base">Level</TableHead>
                        {ageGroups.map(ageKey => (
                            <TableHead key={ageKey} className="text-center min-w-[80px] px-2 text-sm">{reverseAgeGroupMapping[ageKey]}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pointLevelsSorted.map(([points, level]) => {
                        const pointValue = Number(points);
                        const isRowHighlighted = highlightInfo?.points === pointValue;

                        return (
                            <TableRow key={points}>
                                <TableCell className={cn(
                                    "font-extrabold text-xl text-center px-2 transition-all duration-1000",
                                    isRowHighlighted && 'scale-150 bg-accent/30 dark:bg-accent/30 animate-rank-one-glow relative z-10 rounded-lg'
                                )}>{points}</TableCell>
                                <TableCell className="font-semibold px-2 text-base">{level}</TableCell>
                                {ageGroups.map(ageKey => {
                                    const isHighlighted = 
                                        isRowHighlighted &&
                                        highlightInfo &&
                                        ageGroupMapping[highlightInfo.ageRange] === ageKey;

                                    const cellClasses = isHighlighted 
                                        ? 'scale-150 bg-accent/30 dark:bg-accent/30 animate-rank-one-glow relative z-10 rounded-lg' 
                                        : '';
                                    
                                    const benchmarksForAge = sitRiseBenchmarkTextData[gender][ageKey as keyof typeof sitRiseBenchmarkTextData['male']];
                                    const value = benchmarksForAge[points as keyof typeof benchmarksForAge];

                                    return (
                                        <TableCell key={ageKey} className={cn("text-center font-mono px-2 transition-all duration-1000 text-base", cellClasses)}>
                                            {value}
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


export default function SitRiseStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participantId: string; points: number } | null>(null);
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');

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
            setCurrentParticipant(null);
            setLastSubmission(null);
            return;
        }

        const points = calculateSitRisePoints(participant.gender, participant.ageRange, score);
        
        updateScore('sit_rise', participant.id, score);
        
        setCurrentParticipant(participant);
        setLastSubmission({ participantId: participant.id, points });
        setActiveTab(participant.gender);

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score}, earning ${points} points (${pointLevels[points] || 'N/A'}).`,
        });
        
        form.reset();
        const pIdInput = form.elements.namedItem('participantId') as HTMLInputElement;
        pIdInput?.focus();
    };
    
    return (
        <div className="container mx-auto py-8">
            <Card className="w-full shadow-lg border-none">
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 sm:p-6">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl flex items-center gap-3">
                            <PersonStanding className="h-8 w-8 text-accent" />
                            Sit and Rise Benchmark
                        </CardTitle>
                        <CardDescription className="mt-2">
                           {currentParticipant && lastSubmission
                                ? `Highlighting score for ${currentParticipant.name} (${currentParticipant.ageRange}, ${pointLevels[lastSubmission.points]}).`
                                : "Enter score to see participant's rank."}
                        </CardDescription>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-[220px] space-y-2">
                        <Input name="participantId" placeholder="Participant ID" required autoComplete="off" className="h-9"/>
                        <Input name="score" type="number" step="any" min="0" max="10" placeholder="Score (0-10)" required className="h-9"/>
                        <Button type="submit" className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
                    </form>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
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
    );
}
