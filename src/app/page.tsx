import Link from 'next/link';
import Image from 'next/image';
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
            

            <div className="flex items-center justify-center space-x-4 mb-4">
                <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={200} height={213} priority />
            </div>
            
            <div className="w-60 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            <h1 className="mt-14 text-4xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-700">
              Biohacking 1: Fitness Challenge
            </h1>
            <p className="mt-8 max-w-2xl text-xl text-gray-600 leading-relaxed">
              ร่วมทดสอบอายุชีวภาพของร่างกายคุณกับกิจกรรมสุดท้าทายจาก Genfosis
            </p>
            
            <div className="mt-16 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-transform hover:scale-105">
                    <Link href="/register">
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        ลงทะเบียนเข้าร่วมกิจกรรม
                    </Link>
                </Button>
               
            </div>
        </main>

        <footer className="relative z-10 mt-24 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Genfosis Co., Ltd. All Rights Reserved.</p>
        </footer>
    </div>
  );
}
