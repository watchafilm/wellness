
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { stations, StationKey } from "@/lib/stations";

export default function StationPageClient({ stationKey }: { stationKey: StationKey }) {
    const router = useRouter();
    const station = stations[stationKey];
    const { toast } = useToast();

    if (!station) {
        return <p>Station not found.</p>;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const participantId = formData.get('participantId') as string;
        const score = Number(formData.get('score'));

        toast({
            title: `Score Submitted: ${station.name}`,
            description: `Participant ${participantId} scored ${score} ${station.unit}.`,
        });
        e.currentTarget.reset();
        // Optional: redirect after submission
        // router.push('/admin'); 
    };
    
    const Icon = station.icon;

    return (
         <div className="flex flex-col items-center justify-start h-full pt-8">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/20 rounded-lg">
                            <Icon className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">{station.name}</CardTitle>
                            <CardDescription>Enter participant score for this station.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor={`participantId-${stationKey}`}>Participant ID</Label>
                            <Input id={`participantId-${stationKey}`} name="participantId" placeholder="e.g., P004" required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor={`score-${stationKey}`}>Score ({station.unit})</Label>
                            <Input id={`score-${stationKey}`} name="score" type="number" step="any" placeholder={`Enter ${station.unit}`} required className="mt-1" />
                        </div>
                        <Button type="submit" className="w-full !mt-8 bg-primary text-primary-foreground hover:bg-primary/90">Submit Score</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
