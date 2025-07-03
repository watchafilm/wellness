
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { stations } from '@/lib/stations';
import { LayoutDashboard, LogOut, Menu, BarChart2, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';


const navLinks = [
    { href: "/admin", label: "Scoreboard", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Participants", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const { toast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        try {
            const authStatus = localStorage.getItem('isAdminAuthenticated');
            if (authStatus === 'true') {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.replace('/admin/login');
            }
        } catch (error) {
            setIsAuthenticated(false);
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
            toast({ variant: "destructive", title: "Logout Error" });
        }
    };

    if (isAuthenticated === null || isAuthenticated === false) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const NavContent = () => (
        <div className="flex h-full flex-col">
            <header className="p-4 border-b">
                 <Link href="/admin" onClick={() => setIsSheetOpen(false)} className="flex items-center justify-center">
                    <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={500} height={100} className="h-20 w-auto" />
                </Link>
            </header>
            <nav className="flex flex-col gap-2 p-4 text-base font-medium">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",
                            pathname === link.href && "bg-primary/10 text-primary font-semibold"
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Link>
                ))}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="stations" className="border-none">
                        <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:no-underline [&[data-state=open]>svg]:rotate-180">
                            <BarChart2 className="h-5 w-5" />
                            Stations
                        </AccordionTrigger>
                        <AccordionContent className="pl-8">
                            <div className="flex flex-col gap-1 mt-1">
                            {Object.entries(stations).map(([key, station]) => (
                                <Link
                                    key={key}
                                    href={`/admin/station/${key}`}
                                    onClick={() => setIsSheetOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm",
                                        pathname === `/admin/station/${key}` && "bg-primary/10 text-primary font-semibold"
                                    )}
                                >
                                    <station.icon className="h-4 w-4" />
                                    {station.name}
                                </Link>
                            ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </nav>
            <div className="mt-auto p-4">
                 <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    Logout
                 </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full flex-col bg-secondary/50">
            <header className="sticky top-0 z-30 flex h-30 items-center gap-4 border-b bg-card px-4 sm:px-6">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0 bg-card w-[240px] sm:w-[280px]">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">A list of navigation links and actions for the admin dashboard.</SheetDescription>
                        <NavContent />
                    </SheetContent>
                </Sheet>
                 <div className="flex flex-1 items-center justify-center gap-x-10">
                    <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={200} height={400} className="h-20 w-auto" />
                    <div className="h-12 w-px bg-border hidden sm:block" />
                    <h1 className="text-xl text-primary hidden font-bold sm:block">
                        Biohacking 1: Fitness Challenge
                    </h1>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
