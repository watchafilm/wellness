import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Medal, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <div 
            className="absolute inset-0 z-0 opacity-50 dark:opacity-100" 
            style={{
                backgroundImage: 'radial-gradient(circle at center, hsl(var(--secondary)) 0%, hsl(var(--background)) 70%)'
            }}
        />
        <main className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-8">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    <Medal className="mr-2 h-4 w-4 text-accent" />
                    Fitness Challenge 2024
                </span>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-4">
                <h1 className="font-headline text-6xl md:text-8xl font-bold text-primary tracking-tighter">Genfosis</h1>
            </div>
            
            <div className="w-60 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <h1 className="mt-6 text-4xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">
              Biohacking 1: Measurements of Biological Aging
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground leading-relaxed">
              ร่วมทดสอบอายุชีวภาพของร่างกายคุณกับกิจกรรมสุดท้าทายจาก Genfosis
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-transform hover:scale-105">
                    <Link href="/register">
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Register for the Challenge
                    </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="transition-transform hover:scale-105">
                    <Link href="/admin/login">Admin Login &rarr;</Link>
                </Button>
            </div>
        </main>

        <footer className="relative z-10 mt-24 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Genfosis Co., Ltd. All Rights Reserved.</p>
        </footer>
    </div>
  );
}
