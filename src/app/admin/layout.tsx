
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    
    // If the user is on the login page, we don't need to wrap it in the admin layout
    // or perform authentication checks. Just render the login page component.
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
            // Handle cases where localStorage is not available
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

    // If authentication is not yet determined or if the user is unauthenticated (and being redirected),
    // show a loader. This prevents showing a blank page.
    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const NavContent = () => (
        <div className="flex h-full flex-col">
            <nav className="flex flex-col gap-2 p-4 text-base font-medium">
                <Link href="/admin" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-2 text-xl font-headline font-bold mb-4 text-primary px-2">
                   Elite Athlete Tracker
                </Link>
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
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] bg-secondary/50">
            <div className="hidden border-r bg-card md:block">
                <NavContent />
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <Link href="/admin" className="text-lg font-headline font-bold text-primary">Scoreboard</Link>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col p-0 bg-card">
                             <NavContent />
                        </SheetContent>
                    </Sheet>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
