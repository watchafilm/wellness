"use client";

import { useState } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { PersonStanding } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    scoreHeadings,
    ageGroupRows,
    getSitRiseZone,
    mapAppAgeToVisualAge,
} from '@/lib/benchmarks/sit_rise';


const zoneColorClasses: { [key: number]: string } = {
    1: 'bg-red-200/60 dark:bg-red-900/60',
    2: 'bg-yellow-200/60 dark:bg-yellow-700/60',
    3: 'bg-green-300/60 dark:bg-green-800/60',
    4: 'bg-blue-300/60 dark:bg-blue-700/60',
};

const visualAgeToDisplayAge: { [key: string]: string } = {
    '26-30': '20-29 ปี',
    '36-40': '30-39 ปี',
    '46-50': '40-49 ปี',
    '56-60': '50-59 ปี',
    '66-70': '60-69 ปี',
    '76-80': '70+ ปี',
};

function BenchmarkTable({ gender, highlightInfo }: {
    gender: 'male' | 'female';
    highlightInfo: { ageRange: string; score: number; } | null;
}) {
    const highlightedRowAgeGroup = highlightInfo ? mapAppAgeToVisualAge(highlightInfo.ageRange) : null;
    const highlightedScore = highlightInfo ? highlightInfo.score : null;
    const animationKey = highlightInfo ? `${highlightInfo.ageRange}-${highlightInfo.score}` : 'no-highlight';

    return (
        <div className="overflow-x-auto border rounded-lg">
            <Table key={animationKey} className="min-w-full border-collapse">
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="sticky left-0 bg-muted/50 z-10 w-24 min-w-24 text-center font-bold px-2 py-3">Age (Yrs)</TableHead>
                        {scoreHeadings.map(score => (
                            <TableHead key={score} className="text-center font-semibold p-2 w-16 min-w-16">
                                {score.toFixed(1)}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ageGroupRows.map(ageGroup => {
                        const isRowHighlighted = highlightedRowAgeGroup === ageGroup;
                        return (
                            <TableRow key={ageGroup} className="hover:bg-transparent">
                                <TableCell className="sticky left-0 bg-card z-10 text-center font-semibold p-2 border-r">
                                    {visualAgeToDisplayAge[ageGroup] || ageGroup}
                                </TableCell>
                                {scoreHeadings.map(score => {
                                    const zone = getSitRiseZone(gender, ageGroup, score);
                                    const isColHighlighted = score === highlightedScore;
                                    const isCellHighlighted = isRowHighlighted && isColHighlighted;
                                    
                                    return (
                                        <TableCell
                                            key={score}
                                            className={cn(
                                                "text-center p-0 h-10 w-16 min-w-16 relative",
                                                "border-l border-white/20",
                                                zoneColorClasses[zone]
                                            )}
                                        >
                                            {isRowHighlighted && <div className="absolute inset-0 border-y-2 border-accent bg-accent/10 animate-reveal-x origin-left animate-highlight-glow" />}
                                            {isColHighlighted && <div className="absolute inset-0 border-x-2 border-accent bg-accent/10 animate-reveal-y origin-top animate-highlight-glow" />}
                                            
                                            {isCellHighlighted && (
                                                <>
                                                    <div className={cn(
                                                        "absolute inset-0 animate-pop-in border-2 border-accent",
                                                        zoneColorClasses[zone]
                                                    )} />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-pulsing-score">
                                                        <span 
                                                            className="relative font-extrabold text-2xl text-destructive-foreground" 
                                                            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                                                        >
                                                            {score}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
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

export default function SitRiseVisualStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [highlightInfo, setHighlightInfo] = useState<{ ageRange: string; score: number; } | null>(null);
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const participantId = (formData.get('participantId') as string)?.toUpperCase().trim();
        const scoreValue = formData.get('score');
        
        if (!participantId || scoreValue === null || scoreValue === '') {
            toast({ variant: "destructive", title: "Error", description: "Participant ID and score are required." });
            return;
        }

        const score = Number(scoreValue);
        const participant = participants.find(p => p.id.toUpperCase() === participantId);

        if (!participant) {
            toast({ variant: "destructive", title: "Error", description: `Participant ID "${participantId}" not found.` });
            setCurrentParticipant(null);
            setHighlightInfo(null);
            return;
        }
        
        if (score < 0 || score > 10) {
            toast({ variant: "destructive", title: "Invalid Score", description: "Score must be between 0 and 10." });
            return;
        }

        updateScore('sit_rise', participant.id, score);
        
        setCurrentParticipant(participant);
        setHighlightInfo({ ageRange: participant.ageRange, score });
        setActiveTab(participant.gender);

        const visualAgeGroup = mapAppAgeToVisualAge(participant.ageRange);
        const zone = getSitRiseZone(participant.gender, visualAgeGroup, score);
        const zoneText = { 4: 'Excellent', 3: 'Good', 2: 'Average', 1: 'Poor' }[zone];

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score}, which is in the ${zoneText} zone.`,
        });
        
        form.reset();
        const pIdInput = form.elements.namedItem('participantId') as HTMLInputElement;
        pIdInput?.focus();
    };
    
    return (
        <div className="container mx-auto py-8 space-y-6">
             <Card className="w-full shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <PersonStanding className="h-10 w-10 text-primary" />
                         <div>
                            <CardTitle className="font-headline text-3xl">Sit and Rise Test</CardTitle>
                             <CardDescription className="mt-1">
                                {currentParticipant
                                    ? `Showing result for ${currentParticipant.name} (Age: ${currentParticipant.ageRange}, Gender: ${currentParticipant.gender})`
                                    : "Enter participant details to see their result."}
                            </CardDescription>
                        </div>
                    </div>
                     <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full max-w-sm">
                        <div className="flex-1">
                            <label htmlFor="participantId" className="text-sm font-medium text-muted-foreground">Participant ID</label>
                            <Input id="participantId" name="participantId" placeholder="P001" required autoComplete="off" className="h-9 mt-1"/>
                        </div>
                        <div className="w-28">
                             <label htmlFor="score" className="text-sm font-medium text-muted-foreground">Score (0-10)</label>
                            <Input id="score" name="score" type="number" step="0.5" min="0" max="10" placeholder="e.g. 7.5" required className="h-9 mt-1"/>
                        </div>
                        <Button type="submit" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
                    </form>
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'male' | 'female')} className="w-full">
                <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-4">
                    <TabsTrigger value="male">Male</TabsTrigger>
                    <TabsTrigger value="female">Female</TabsTrigger>
                </TabsList>
                <TabsContent value="male">
                    <BenchmarkTable 
                        gender="male"
                        highlightInfo={currentParticipant?.gender === 'male' ? highlightInfo : null}
                    />
                </TabsContent>
                <TabsContent value="female">
                     <BenchmarkTable 
                        gender="female"
                        highlightInfo={currentParticipant?.gender === 'female' ? highlightInfo : null}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
