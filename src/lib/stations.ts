
import type { LucideIcon } from 'lucide-react';
import { BarChart, Dumbbell, Footprints, Hand, PersonStanding, Ruler, Timer } from 'lucide-react';

export interface StationConfig {
    name: string;
    unit: string;
    icon: LucideIcon;
    benchmarks: {
        good: number;
        excellent: number;
        lowerIsBetter?: boolean;
    };
}

export const stations: Record<string, StationConfig> = {
    pushups: { name: "Push Ups", unit: "reps", icon: Dumbbell, benchmarks: { good: 20, excellent: 30 } },
    sit_rise: { name: "Sit and Rise", unit: "points", icon: PersonStanding, benchmarks: { good: 3, excellent: 4 } },
    sit_reach: { name: "Sit and Reach", unit: "cm", icon: Ruler, benchmarks: { good: 18, excellent: 25 } },
    one_leg: { name: "One Leg Stand", unit: "secs", icon: Footprints, benchmarks: { good: 30, excellent: 45 } },
    reaction: { name: "Reaction Time", unit: "s", icon: Timer, benchmarks: { good: 0.35, excellent: 0.25, lowerIsBetter: true } },
    wh_ratio: { name: "Waist-Height Ratio", unit: "ratio", icon: BarChart, benchmarks: { good: 0.5, excellent: 0.48, lowerIsBetter: true } },
    grip: { name: "Grip Strength", unit: "kg", icon: Hand, benchmarks: { good: 45, excellent: 55 } },
};

export type StationKey = keyof typeof stations;
export type Scores = { [key in StationKey]: number };

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

export const getLevel = (score: number, good: number, excellent: number, lowerIsBetter = false): { text: string; variant: BadgeVariant } => {
    if (lowerIsBetter) {
        if (score <= excellent) return { text: "Excellent", variant: "default" };
        if (score <= good) return { text: "Good", variant: "secondary" };
        return { text: "Needs Improvement", variant: "destructive" };
    }
    if (score >= excellent) return { text: "Excellent", variant: "default" };
    if (score >= good) return { text: "Good", variant: "secondary" };
    return { text: "Needs Improvement", variant: "destructive" };
};

export const mockParticipantsData: { id: string; name: string; age: number; scores: Scores }[] = [
  { id: 'P001', name: 'John Doe', age: 25, scores: { pushups: 35, sit_rise: 4, sit_reach: 20, one_leg: 45, reaction: 0.3, wh_ratio: 0.48, grip: 55 }},
  { id: 'P002', name: 'Jane Smith', age: 32, scores: { pushups: 22, sit_rise: 3, sit_reach: 25, one_leg: 30, reaction: 0.35, wh_ratio: 0.5, grip: 40 }},
  { id: 'P003', name: 'Mike Johnson', age: 41, scores: { pushups: 18, sit_rise: 2, sit_reach: 15, one_leg: 20, reaction: 0.4, wh_ratio: 0.52, grip: 60 }},
];
