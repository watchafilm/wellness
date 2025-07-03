
"use client";

import { useState } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Ruler } from 'lucide-react';
import { 
    sitReachBenchmarkData, 
    calculateSitReachResult, 
    ageGroupMapping,
    reverseAgeGroupMapping,
    displayCategories
} from '@/lib/benchmarks/sit_reach';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function BenchmarkTable({ gender, highlightInfo }: { 
    gender: 'male' | 'female';
    highlightInfo: { ageRange: string; percentile: number; } | null;
}) {
    const ageGroups = Object.keys(sitReachBenchmarkData[gender]);

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center px-2">Percentile</TableHead>
                        <TableHead className="w-[150px] px-2">Category</TableHead>
                        {ageGroups.map(ageKey => (
                            <TableHead key={ageKey} className="text-center min-w-[80px] px-2 text-sm">{reverseAgeGroupMapping[ageKey]}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayCategories.map((category) => {
                        const isRowHighlighted = highlightInfo?.percentile === category.percentile;
                        return (
                            <TableRow key={category.percentile} className={cn(isRowHighlighted && 'bg-accent/30')}>
                                <TableCell className={cn(
                                    "font-extrabold text-xl text-center px-2 transition-all duration-500",
                                    isRowHighlighted && 'scale-125 text-primary'
                                )}>{category.percentile}</TableCell>
                                <TableCell className="font-semibold px-2">{category.label}</TableCell>
                                {ageGroups.map(ageKey => {
                                    const ageData = sitReachBenchmarkData[gender][ageKey as keyof typeof sitReachBenchmarkData.male];
                                    const score = ageData[category.percentile as keyof typeof ageData];
                                    const isCellHighlighted = isRowHighlighted && ageGroupMapping[highlightInfo.ageRange] === ageKey;

                                    return (
                                        <TableCell key={ageKey} className={cn(
                                            "text-center font-mono px-2 transition-all duration-500",
                                            isCellHighlighted && 'font-bold scale-125 text-primary'
                                        )}>
                                            {`≥ ${score}`}
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

export default function SitReachStationPage() {
    const { participants, updateScore } = useParticipants();
    const { toast } = useToast();
    const [lastSubmission, setLastSubmission] = useState<{ participantId: string; percentile: number } | null>(null);
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

        const result = calculateSitReachResult(participant.gender, participant.ageRange, score);
        
        updateScore('sit_reach', participant.id, score);
        
        setCurrentParticipant(participant);
        setLastSubmission({ participantId: participant.id, percentile: result.percentile });
        setActiveTab(participant.gender);

        toast({
            title: "Score Submitted!",
            description: `${participant.name} is in the "${result.label}" category (Percentile ${result.percentile}+).`,
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
                            <Ruler className="h-8 w-8 text-accent" />
                            Sit and Reach Test
                        </CardTitle>
                        <CardDescription className="mt-2">
                           {currentParticipant && lastSubmission
                                ? `Highlighting score for ${currentParticipant.name} (${currentParticipant.ageRange}).`
                                : "Enter score to see participant's category."}
                        </CardDescription>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-[220px] space-y-2">
                        <Input name="participantId" placeholder="Participant ID" required autoComplete="off" className="h-9"/>
                        <Input name="score" type="number" step="1" min="0" placeholder="Score (cm)" required className="h-9"/>
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
                                    percentile: lastSubmission.percentile
                                } : null}
                            />
                        </TabsContent>
                        <TabsContent value="female">
                             <BenchmarkTable 
                                gender="female"
                                highlightInfo={currentParticipant?.gender === 'female' && lastSubmission ? {
                                    ageRange: currentParticipant.ageRange,
                                    percentile: lastSubmission.percentile
                                } : null}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
