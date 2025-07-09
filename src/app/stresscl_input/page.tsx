
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useParticipants } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ParticipantSearch } from '@/components/admin/ParticipantSearch';
import { Loader2, BrainCircuit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  participantId: z.string().min(1, { message: "Please select a participant." }),
  physicalStress: z.number({ required_error: "This field is required." }).min(0, "Value must be 0 or more.").max(100, "Value must be 100 or less."),
  mentalStress: z.number({ required_error: "This field is required." }).min(0, "Value must be 0 or more.").max(100, "Value must be 100 or less."),
});

export default function StressInputPage() {
    const { toast } = useToast();
    const { participants, updateStressScores, loading } = useParticipants();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            participantId: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await updateStressScores(values.participantId, values.physicalStress, values.mentalStress);
            toast({
              title: "Success!",
              description: `Stress scores for ${values.participantId} have been saved.`,
            });
            form.reset(); // Reset form fields for next entry
        } catch (error) {
            // Error toast is already handled in the useParticipants hook
            console.error("Failed to submit stress scores:", error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-secondary/50 p-4">
            <div className="absolute top-4 left-4">
                <Button asChild variant="ghost">
                    <Link href="/stresscl">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Display
                    </Link>
                </Button>
            </div>
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
                        <BrainCircuit className="h-6 w-6"/>
                    </div>
                    <CardTitle className="font-headline text-2xl">Stress Score Input</CardTitle>
                    <CardDescription>Enter participant's stress scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="participantId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Participant</FormLabel>
                                        <ParticipantSearch
                                            participants={participants}
                                            value={field.value}
                                            onSelect={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="physicalStress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Physical Stress Score (0-100)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter score from device" 
                                                {...field} 
                                                onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="mentalStress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mental Stress Score (0-100)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter score from device" 
                                                {...field} 
                                                onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting} className="w-full !mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Submit Scores
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
