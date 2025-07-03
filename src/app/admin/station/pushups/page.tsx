
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29", "30-39 ปี": "30-39", "40-49 ปี": "40-49",
    "50-59 ปี": "50-59", "60-69 ปี": "60-69", "70+ ปี": "70+",
};

function BenchmarkTable({ gender, ageRange, highlightedPoints }: { gender: 'male' | 'female', ageRange: string, highlightedPoints: number | null }) {
    const ageKey = useMemo(() => ageGroupMapping[ageRange], [ageRange]);
    
    if (!ageKey) return <p className="text-center text-destructive">Invalid age range provided.</p>;

    const benchmarks = useMemo(() => pushupsBenchmarkTextData[gender][ageKey as keyof typeof pushupsBenchmarkTextData.male], [gender, ageKey]);
    
    if (!benchmarks) return <p className="text-center text-destructive">No benchmark data for this group.</p>;

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center">Points</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Reps (reps/min)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(pointLevels).sort((a, b) => Number(b[0]) - Number(a[0])).map(([points, level]) => {
                        const rank = Number(points);
                        const isHighlighted = rank === highlightedPoints;
                        const rankClasses = isHighlighted ? 'bg-yellow-400/30 dark:bg-yellow-500/30 animate-rank-one-glow' : '';
                        
                        return (
                            <TableRow key={points} className={cn("transition-colors", rankClasses)}>
                                <TableCell className="font-extrabold text-xl text-center">{points}</TableCell>
                                <TableCell className="font-semibold">{level}</TableCell>
                                <TableCell className="text-right font-mono text-lg">{benchmarks[points as keyof typeof benchmarks]}</TableCell>
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
    const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(undefined);
    
    const reverseAgeGroupMapping = useMemo(() => Object.fromEntries(Object.entries(ageGroupMapping).map(([key, value]) => [value, key])), []);

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
            setActiveAccordionItem(undefined);
            return;
        }

        const points = calculatePushupsPoints(participant.gender, participant.ageRange, score);
        
        updateScore('pushups', participant.id, score);
        
        setCurrentParticipant(participant);
        setLastSubmission({ participantId: participant.id, points });

        setActiveTab(participant.gender);
        const ageKey = ageGroupMapping[participant.ageRange];
        setActiveAccordionItem(`${participant.gender}-${ageKey}`);

        toast({
            title: "Score Submitted!",
            description: `${participant.name} scored ${score} reps, earning ${points} points (${pointLevels[points] || 'N/A'}).`,
        });
        
        const form = e.currentTarget;
        const scoreInput = form.elements.namedItem('score') as HTMLInputElement;
        if (scoreInput) scoreInput.value = '';
        scoreInput?.focus();
    };

    useEffect(() => {
       if (lastSubmission) {
           const timer = setTimeout(() => {
               setLastSubmission(null);
           }, 3500); 
           return () => clearTimeout(timer);
       }
    }, [lastSubmission]);
    
    const renderAccordion = (gender: 'male' | 'female') => (
        <Accordion 
            type="single" 
            collapsible 
            value={activeAccordionItem} 
            onValueChange={setActiveAccordionItem} 
            className="w-full space-y-2"
        >
            {Object.keys(pushupsBenchmarkTextData[gender]).map((ageDataKey) => {
                const itemValue = `${gender}-${ageDataKey}`;
                return (
                    <AccordionItem key={itemValue} value={itemValue} className="border-b-0 rounded-lg bg-card transition-colors hover:bg-secondary/50">
                        <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline rounded-lg">
                            {reverseAgeGroupMapping[ageDataKey]}
                        </AccordionTrigger>
                        <AccordionContent className="px-1 pb-1">
                             <BenchmarkTable 
                                gender={gender}
                                ageRange={reverseAgeGroupMapping[ageDataKey]}
                                highlightedPoints={
                                    currentParticipant?.gender === gender && 
                                    ageGroupMapping[currentParticipant.ageRange] === ageDataKey &&
                                    lastSubmission?.participantId === currentParticipant.id
                                    ? lastSubmission.points
                                    : null
                                }
                            />
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );

    return (
         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
            <div className="lg:col-span-1">
                <Card className="w-full shadow-lg border-none sticky top-8">
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
            
            <div className="lg:col-span-2">
                <Card className="w-full shadow-lg border-none min-h-[500px]">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Trophy className="text-accent" /> Push-ups Benchmark
                        </CardTitle>
                        <CardDescription>
                            {currentParticipant && lastSubmission
                                ? `Highlighting score for ${currentParticipant.name} (Age: ${currentParticipant.ageRange})`
                                : "Submit a score to automatically select and expand the relevant benchmark."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'male' | 'female')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="male">Male</TabsTrigger>
                                <TabsTrigger value="female">Female</TabsTrigger>
                            </TabsList>
                            <TabsContent value="male">
                                {renderAccordion('male')}
                            </TabsContent>
                            <TabsContent value="female">
                                {renderAccordion('female')}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
