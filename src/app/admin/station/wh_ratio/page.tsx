
"use client";

import { useState } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    calculateWhRatioPoints,
    whRatioPointData,
    femaleWaistValues,
    femaleHeightValues,
    maleWaistValues,
    maleHeightValues,
    pointLevels,
    pointColors,
} from '@/lib/benchmarks/wh_ratio';

function BenchmarkTable({ gender, highlightInfo }: {
    gender: 'male' | 'female';
    highlightInfo: { waist: number; height: number } | null;
}) {
    const waistValues = gender === 'male' ? maleWaistValues : femaleWaistValues;
    const heightValues = gender === 'male' ? maleHeightValues : femaleHeightValues;
    const data = whRatioPointData[gender];

    const getPointsForCell = (waist: number, height: number): number => {
        const thresholds = data[waist];
        if (!thresholds) return 1;
        for (const threshold of thresholds) {
            if (height <= threshold.toHeight) {
                return threshold.points;
            }
        }
        return 1;
    };

    return (
        <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-full border-collapse">
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="sticky left-0 bg-muted/50 z-20 w-24 min-w-24 text-center font-bold px-2 py-3 border-r">Waist (in)</TableHead>
                        {heightValues.map(h => (
                            <TableHead key={h} className="text-center font-semibold p-2 w-16 min-w-16">
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {waistValues.map(w => (
                        <TableRow key={w} className="hover:bg-transparent">
                            <TableCell className="sticky left-0 bg-card z-20 text-center font-semibold p-2 border-r">
                                {w}
                            </TableCell>
                            {heightValues.map(h => {
                                const points = getPointsForCell(w, h);
                                const ratio = (w / h).toFixed(2);
                                const isCellHighlighted = highlightInfo?.waist === w && highlightInfo?.height === h;

                                return (
                                    <TableCell
                                        key={h}
                                        className={cn(
                                            "text-center p-0 h-14 w-16 min-w-16 relative transition-all duration-300",
                                            pointColors[points]
                                        )}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-xs font-mono text-foreground/70">{ratio}</span>
                                        </div>
                                         {isCellHighlighted && (
                                            <div className="absolute inset-0 ring-4 ring-primary ring-offset-2 ring-offset-card animate-pop-in z-10" />
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function WhRatioStationPage() {
    const { participants, updateScore, loading } = useParticipants();
    const { toast } = useToast();
    const [highlightInfo, setHighlightInfo] = useState<{ waist: number; height: number; } | null>(null);
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        const formData = new FormData(form);
        const participantId = (formData.get('participantId') as string)?.toUpperCase().trim();
        const waist = Number(formData.get('waist'));
        const height = Number(formData.get('height'));
        
        if (!participantId || !waist || !height) {
            toast({ variant: "destructive", title: "Error", description: "All fields are required." });
            return;
        }

        const participant = participants.find(p => p.id.toUpperCase() === participantId);

        if (!participant) {
            toast({ variant: "destructive", title: "Error", description: `Participant ID "${participantId}" not found.` });
            setCurrentParticipant(null);
            setHighlightInfo(null);
            return;
        }
        
        const result = calculateWhRatioPoints(participant.gender, waist, height);
        if (!result) {
             toast({ variant: "destructive", title: "Out of Range", description: "Waist or Height is out of the chart's range." });
             setHighlightInfo(null);
             return;
        }

        updateScore('wh_ratio', participant.id, result.ratio);
        
        setCurrentParticipant(participant);
        setHighlightInfo({ waist: result.closestWaist, height: result.closestHeight });
        setActiveTab(participant.gender);
        
        form.reset();
        const pIdInput = form.elements.namedItem('participantId') as HTMLInputElement;
        pIdInput?.focus();
    };
    
    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center pt-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-8 space-y-6">
             <Card className="w-full shadow-lg border-none">
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-6">
                    <div className="flex items-center gap-4 flex-1">
                        <HeartPulse className="h-10 w-10 text-primary hidden sm:block" />
                         <div>
                            <CardTitle className="font-headline text-3xl">Waist-to-Height Ratio</CardTitle>
                             <CardDescription className="mt-1">
                                {currentParticipant
                                    ? `Showing result for ${currentParticipant.name} (Gender: ${currentParticipant.gender})`
                                    : "Enter participant details to see their result."}
                            </CardDescription>
                        </div>
                    </div>
                     <form onSubmit={handleSubmit} className="flex flex-wrap sm:flex-nowrap items-end gap-2 w-full md:w-auto">
                        <div className="flex-1 min-w-[120px]">
                            <label htmlFor="participantId" className="text-sm font-medium text-muted-foreground">Participant ID</label>
                            <Input id="participantId" name="participantId" placeholder="P001" required autoComplete="off" className="h-9 mt-1"/>
                        </div>
                         <div className="w-28">
                             <label htmlFor="waist" className="text-sm font-medium text-muted-foreground">Waist (in)</label>
                            <Input id="waist" name="waist" type="number" step="1" min="0" placeholder="e.g. 34" required className="h-9 mt-1"/>
                        </div>
                        <div className="w-28">
                             <label htmlFor="height" className="text-sm font-medium text-muted-foreground">Height (in)</label>
                            <Input id="height" name="height" type="number" step="1" min="0" placeholder="e.g. 68" required className="h-9 mt-1"/>
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
                 <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mb-4 text-xs">
                    <div className="flex items-center gap-1.5"><div className={cn("w-3 h-3 rounded-sm", pointColors[5])}></div>5 Points (Healthy)</div>
                    <div className="flex items-center gap-1.5"><div className={cn("w-3 h-3 rounded-sm", pointColors[4])}></div>4 Points (Acceptable)</div>
                    <div className="flex items-center gap-1.5"><div className={cn("w-3 h-3 rounded-sm", pointColors[3])}></div>3 Points (Overweight)</div>
                    <div className="flex items-center gap-1.5"><div className={cn("w-3 h-3 rounded-sm", pointColors[2])}></div>2 Points (High Risk)</div>
                    <div className="flex items-center gap-1.5"><div className={cn("w-3 h-3 rounded-sm", pointColors[1])}></div>1 Point (V. High Risk)</div>
                </div>
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
