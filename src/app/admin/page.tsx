"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { BarChart, Dumbbell, Footprints, Hand, Loader2, LogOut, PersonStanding, Ruler, Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock Data
const mockParticipantsData = [
  { id: 'P001', name: 'John Doe', age: 25, scores: { pushups: 35, sit_rise: 4, sit_reach: 20, one_leg: 45, reaction: 0.3, wh_ratio: 0.48, grip: 55 }},
  { id: 'P002', name: 'Jane Smith', age: 32, scores: { pushups: 22, sit_rise: 3, sit_reach: 25, one_leg: 30, reaction: 0.35, wh_ratio: 0.5, grip: 40 }},
  { id: 'P003', name: 'Mike Johnson', age: 41, scores: { pushups: 18, sit_rise: 2, sit_reach: 15, one_leg: 20, reaction: 0.4, wh_ratio: 0.52, grip: 60 }},
];

// Helper to get performance level
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;
const getLevel = (score: number, good: number, excellent: number, lowerIsBetter = false): { text: string; variant: BadgeVariant } => {
    if (lowerIsBetter) {
        if (score <= excellent) return { text: "Excellent", variant: "default" };
        if (score <= good) return { text: "Good", variant: "secondary" };
        return { text: "Needs Improvement", variant: "destructive" };
    }
    if (score >= excellent) return { text: "Excellent", variant: "default" };
    if (score >= good) return { text: "Good", variant: "secondary" };
    return { text: "Needs Improvement", variant: "destructive" };
};

// Station Config
const stations = {
    pushups: { name: "Push Ups", unit: "reps", icon: Dumbbell, benchmarks: { good: 20, excellent: 30 } },
    sit_rise: { name: "Sit and Rise", unit: "points", icon: PersonStanding, benchmarks: { good: 3, excellent: 4 } },
    sit_reach: { name: "Sit and Reach", unit: "cm", icon: Ruler, benchmarks: { good: 18, excellent: 25 } },
    one_leg: { name: "One Leg Stand", unit: "secs", icon: Footprints, benchmarks: { good: 30, excellent: 45 } },
    reaction: { name: "Reaction Time", unit: "s", icon: Timer, benchmarks: { good: 0.35, excellent: 0.25, lowerIsBetter: true } },
    wh_ratio: { name: "Waist-Height Ratio", unit: "ratio", icon: BarChart, benchmarks: { good: 0.5, excellent: 0.48, lowerIsBetter: true } },
    grip: { name: "Grip Strength", unit: "kg", icon: Hand, benchmarks: { good: 45, excellent: 55 } },
};

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [participants, setParticipants] = useState(mockParticipantsData);
  const latestParticipant = participants[participants.length - 1];

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem('isAdminAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        router.replace('/admin/login');
      }
    } catch (error) {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAdminAuthenticated');
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/admin/login');
    } catch (error) {
        console.error("Could not remove item from localStorage", error);
    }
  };

  const StationForm = ({ stationKey }: { stationKey: keyof typeof stations }) => {
    const station = stations[stationKey];
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
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor={`participantId-${stationKey}`}>Participant ID</Label>
                <Input id={`participantId-${stationKey}`} name="participantId" placeholder="e.g., P004" required />
            </div>
            <div>
                <Label htmlFor={`score-${stationKey}`}>Score ({station.unit})</Label>
                <Input id={`score-${stationKey}`} name="score" type="number" step="any" placeholder={`Enter ${station.unit}`} required />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Submit Score</Button>
        </form>
    );
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50">
      <header className="bg-card border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <h1 className="text-xl font-headline font-bold text-primary">Elite Athlete Tracker</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Latest Participant Score</CardTitle>
            <CardDescription>Real-time results for {latestParticipant.name} (ID: {latestParticipant.id}, Age: {latestParticipant.age})</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(stations).map(([key, config]) => {
                  const score = latestParticipant.scores[key as keyof typeof latestParticipant.scores];
                  const level = getLevel(score, config.benchmarks.good, config.benchmarks.excellent, config.benchmarks.lowerIsBetter);
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{config.name}</TableCell>
                      <TableCell className="text-right">{score} {config.unit}</TableCell>
                      <TableCell className="text-right"><Badge variant={level.variant}>{level.text}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Tabs defaultValue="leaderboard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Full Leaderboard</TabsTrigger>
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Challenge Leaderboard</CardTitle>
                <CardDescription>Complete scores for all participants.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      {Object.values(stations).map(s => <TableHead key={s.name}>{s.name}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}<br/><span className="text-xs text-muted-foreground">{p.id}</span></TableCell>
                        <TableCell>{p.age}</TableCell>
                        {Object.keys(stations).map(key => <TableCell key={key}>{p.scores[key as keyof typeof p.scores]}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data-entry">
            <Card>
              <CardHeader>
                <CardTitle>Enter Station Scores</CardTitle>
                <CardDescription>Select a station to input a participant's score. Age-based scoring will be applied automatically.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pushups" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1 h-auto">
                    {Object.keys(stations).map(key => <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">{stations[key as keyof typeof stations].name}</TabsTrigger>)}
                  </TabsList>
                  {Object.keys(stations).map(key => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <Card className="max-w-md mx-auto">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                           {(() => {
                                const Icon = stations[key as keyof typeof stations].icon;
                                return <Icon className="h-6 w-6 text-accent"/>
                           })()}
                           <CardTitle>{stations[key as keyof typeof stations].name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <StationForm stationKey={key as keyof typeof stations} />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
