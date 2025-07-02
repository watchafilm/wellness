"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ageRanges = ["20-29 ปี", "30-39 ปี", "40-49 ปี", "50-59 ปี", "60-69 ปี", "70+ ปี"] as const;

const formSchema = z.object({
  firstName: z.string().min(2, { message: "กรุณากรอกชื่อจริงอย่างน้อย 2 ตัวอักษร" }),
  lastName: z.string().min(2, { message: "กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร" }),
  gender: z.enum(["male", "female"], {
    required_error: "กรุณาเลือกเพศ",
  }),
  ageRange: z.enum(ageRanges, {
    required_error: "กรุณาเลือกช่วงอายุ",
  }),
  phone: z.string().regex(/^(0\d{9})$/, { message: "กรุณากรอกเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง" }),
  email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
  lineId: z.string().optional(),
});


export function RegistrationForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      lineId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    toast({
      title: "ลงทะเบียนสำเร็จ!",
      description: "ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว แล้วพบกันในกิจกรรม!",
    });
    
    form.reset();
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader className="items-center text-center">
        <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={100} height={159} priority className="mb-4" />
        <CardTitle className="font-headline text-3xl text-primary">ลงทะเบียนเข้าร่วมกิจกรรม</CardTitle>
      
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อจริง</FormLabel>
                    <FormControl>
                      <Input placeholder="โปรดกรอกชื่อของคุณ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="โปรดกรอกนามสกุลของคุณ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>เพศ</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">ชาย</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">หญิง</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ช่วงอายุ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="กรุณาเลือกช่วงอายุของคุณ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ageRanges.map(range => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input placeholder="0812345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
            
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="lineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LINE ID (ถ้ามี)</FormLabel>
                    <FormControl>
                      <Input placeholder="yourlineid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">ลงทะเบียน</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
