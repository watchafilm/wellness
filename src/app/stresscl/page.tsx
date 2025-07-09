
"use client";

import { useParticipants, type Participant } from '@/lib/data';
import { Loader2, FilePenLine } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

// Helper component for the stress display circles
const StressCircle = ({ value, label, size, className }: { value?: number, label: string, size: 'large' | 'medium', className?: string }) => {
    const sizeClasses = {
        large: 'w-64 h-64 text-6xl border-[16px]',
        medium: 'w-40 h-40 text-4xl border-8',
    };
    
    const getRingColor = (val: number) => {
        if (val >= 80) return 'border-cyan-400 shadow-cyan-400/50';
        if (val >= 60) return 'border-green-400 shadow-green-400/50';
        if (val >= 40) return 'border-yellow-400 shadow-yellow-400/50';
        if (val >= 20) return 'border-orange-500 shadow-orange-500/50';
        return 'border-red-500 shadow-red-500/50';
    };

    const ringColor = value !== undefined ? getRingColor(value) : 'border-muted';

    return (
        <div className={cn(
            'relative rounded-full flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm shadow-2xl transition-all',
            sizeClasses[size],
            ringColor,
            'shadow-lg',
            className
        )}>
            <span className="font-bold tracking-tighter text-white drop-shadow-lg">
                {value !== undefined ? Math.round(value) : '-'}
            </span>
            <span className="text-sm font-medium text-gray-300 mt-2">{label}</span>
        </div>
    );
};


const StressDisplay = ({ participant }: { participant: Participant | null }) => {
    if (!participant || !participant.stress) {
        return (
            <div className="text-center py-20 text-white min-h-[480px] flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold">No Stress Data</h2>
                <p className="text-gray-300 mt-2">Submit a score to see the results here.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center gap-8 py-10 min-h-[480px] justify-center">
            <h2 className="text-4xl font-bold text-white text-center drop-shadow-md">
                {participant.name}
            </h2>
            <div className="flex flex-col items-center gap-6">
                <StressCircle value={participant.stress.overall} label="OVERALL STRESS" size="large" />
                <div className="flex gap-6">
                    <StressCircle value={participant.stress.physical} label="PHYSICAL" size="medium" />
                    <StressCircle value={participant.stress.mental} label="MENTAL" size="medium" />
                </div>
            </div>
        </div>
    );
}

export default function StressPage() {
    const { participants, loading } = useParticipants();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get('id');

    const { activeParticipant, rankedParticipants } = useMemo(() => {
        const participantsWithStress = participants.filter(p => p.stress);
        
        if (participantsWithStress.length === 0) {
            return { activeParticipant: null, rankedParticipants: [] };
        }

        const ranked = [...participantsWithStress].sort((a, b) => (a.stress?.overall || 0) - (b.stress?.overall || 0));
        
        let active;
        if (selectedId) {
            active = participantsWithStress.find(p => p.id === selectedId) || null;
        }
        
        if (!active) {
            // If no ID is selected, or the ID is invalid, show the most recently updated.
            const sortedByTime = [...participantsWithStress].sort((a, b) => (b.stress?.updatedAt || 0) - (a.stress?.updatedAt || 0));
            active = sortedByTime[0] || null;
        }

        return { activeParticipant: active, rankedParticipants: ranked };

    }, [participants, selectedId]);


    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <Image
                src="https://www.genfosis.com/images/stress-background.png"
                alt="Abstract background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-30"
                data-ai-hint="abstract space"
                priority
            />
             <div className="relative z-10 max-w-7xl mx-auto">
                <StressDisplay participant={activeParticipant} />

                <Card className="mt-12 bg-gray-900/70 border-gray-700/50 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-white">Stress Scoreboard</CardTitle>
                        <CardDescription className="text-gray-300">
                            Participants ranked by lowest overall stress score.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                    <TableHead className="w-[100px] text-white">Rank</TableHead>
                                    <TableHead className="text-white">Name</TableHead>
                                    <TableHead className="text-right text-white">Overall Stress</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankedParticipants.map((p, index) => (
                                    <TableRow key={p.id} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell className="font-medium text-2xl">{index + 1}</TableCell>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="text-right font-semibold text-lg">{p.stress?.overall.toFixed(1)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
             <div className="fixed bottom-8 right-8 z-20">
                <Button asChild size="icon" className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-transform hover:scale-105">
                <Link href="/stresscl_input">
                    <FilePenLine className="h-6 w-6" />
                    <span className="sr-only">Input Scores</span>
                </Link>
                </Button>
            </div>
        </div>
    );
}
