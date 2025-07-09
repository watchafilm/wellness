
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

const StressDisplay = ({ participant }: { participant: Participant | null }) => {
    if (!participant || !participant.stress) {
        return (
            <div className="text-center py-20 text-gray-600 min-h-[480px] flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold">No Stress Data</h2>
                <p className="text-gray-500 mt-2">Submit a score to see the results here.</p>
            </div>
        );
    }

    const overallStress = participant.stress?.overall;
    const physicalStress = participant.stress?.physical;
    const mentalStress = participant.stress?.mental;
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-30 lg:gap-36">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold tracking-widest mb-8 text-center">OVERALL STRESS</h2>
                    {/* Big Circle for Overall */}
                    <div className="relative w-56 h-56 md:w-64 md:h-64">
                         <div
                            className="absolute inset-0 rounded-full bg-cyan-100/50"
                            style={{
                                boxShadow: 'inset 0 0 40px rgba(100, 200, 220, 0.4), 0 0 20px rgba(100, 200, 220, 0.2)'
                            }}
                        />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl font-bold tracking-tighter">
                            {overallStress !== undefined ? Math.round(overallStress) : '0'}
                        </span>
                    </div>
                </div>

                {/* Physical and Mental Scores */}
                <div className="flex flex-col gap-10 text-center md:text-left">
                    <div>
                        <h3 className="text-xl tracking-wider font-semibold">PHYSICAL STRESS</h3>
                        <p className="text-7xl font-bold text-cyan-700 mt-1 tracking-tighter">
                            {physicalStress !== undefined ? Math.round(physicalStress) : '0'}
                        </p>
                    </div>
                    <div className="w-48 h-px bg-gray-300 mx-auto md:mx-0" />
                    <div>
                        <h3 className="text-xl tracking-wider font-semibold">MENTAL STRESS</h3>
                        <p className="text-7xl font-bold text-cyan-700 mt-1 tracking-tighter">
                            {mentalStress !== undefined ? Math.round(mentalStress) : '0'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StressPage() {
    const { participants, loading } = useParticipants();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get('id');

    const backgroundImageUrl = 'https://drive.google.com/uc?export=download&id=12rQ7G9lqrp1niFqZJsYLyChWFEJJJGjn';

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
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-white text-black">
            <Image
                src={backgroundImageUrl}
                alt="Abstract light blue background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-80"
                data-ai-hint="abstract light"
                priority
            />

            <header className="absolute top-6 right-8 z-20">
                <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={150} height={32} />
            </header>
            
            <main className="relative z-4 grid grid-cols-1 md:grid-cols-6 min-h-screen">
                <aside className="col-span-2 p-4 md:p-14 flex flex-col justify-center">
                    <Card className="bg-white/60 border-gray-200/50 backdrop-blur-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-gray-800">Stress Scoreboard</CardTitle>
                            <CardDescription className="text-gray-600">
                                Participants ranked by lowest overall stress score.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 hover:bg-gray-100/50">
                                        <TableHead className="w-[80px] text-gray-700">Rank</TableHead>
                                        <TableHead className="text-gray-700">Name</TableHead>
                                        <TableHead className="text-right text-gray-700">Overall Stress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rankedParticipants.map((p, index) => (
                                        <TableRow key={p.id} className="border-gray-200 hover:bg-gray-100/50">
                                            <TableCell className="font-medium text-xl">{index + 1}</TableCell>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell className="text-right font-semibold text-lg">{p.stress?.overall.toFixed(1)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </aside>
                <section className="col-span-3 flex items-center justify-start p-4">
                    <StressDisplay participant={activeParticipant} />
                </section>
            </main>
            
             <div className="fixed bottom-8 right-8 z-20">
                <Button asChild size="icon" className="h-14 w-14 rounded-full bg-slate-700 text-white shadow-lg hover:bg-slate-800 transition-transform hover:scale-105">
                    <Link href="/stresscl_input">
                        <FilePenLine className="h-6 w-6" />
                        <span className="sr-only">Input Scores</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
