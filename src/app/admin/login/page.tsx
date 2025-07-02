"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem("isAdminAuthenticated") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username === "genfosis" && values.password === "sisfogen") {
      try {
        localStorage.setItem("isAdminAuthenticated", "true");
        toast({ title: "Login Successful", description: "Redirecting to the admin dashboard..." });
        router.push("/admin");
      } catch (error) {
        console.error("Could not set item in localStorage", error);
        toast({ variant: "destructive", title: "Login Error", description: "Could not start session. Please enable cookies/site data." });
      }
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Lock className="h-6 w-6"/>
          </div>
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="genfosis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !mt-6 bg-accent text-accent-foreground hover:bg-accent/90">Log In</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
