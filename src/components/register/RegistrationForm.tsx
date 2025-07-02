"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "กรุณากรอกชื่อจริงอย่างน้อย 2 ตัวอักษร" }),
  lastName: z.string().min(2, { message: "กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร" }),
  gender: z.enum(["male", "female"], {
    required_error: "กรุณาเลือกเพศ",
  }),
  dob: z.date({
    required_error: "กรุณาเลือกวันเดือนปีเกิดให้ครบถ้วน",
  }),
  phone: z.string().regex(/^(0\d{9})$/, { message: "กรุณากรอกเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง" }),
  email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
  lineId: z.string().optional(),
});

const currentBEYear = new Date().getFullYear() + 543;
const years = Array.from({ length: 100 }, (_, i) => (currentBEYear - i).toString());

const months = [
    { value: "1", label: "มกราคม" },
    { value: "2", label: "กุมภาพันธ์" },
    { value: "3", label: "มีนาคม" },
    { value: "4", label: "เมษายน" },
    { value: "5", label: "พฤษภาคม" },
    { value: "6", label: "มิถุนายน" },
    { value: "7", label: "กรกฎาคม" },
    { value: "8", label: "สิงหาคม" },
    { value: "9", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export function RegistrationForm() {
  const { toast } = useToast();
  const [selectedDob, setSelectedDob] = useState({ day: "", month: "", year: "" });

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

  useEffect(() => {
    const { day, month, year } = selectedDob;
    if (day && month && year) {
      const yearAD = parseInt(year, 10) - 543;
      const monthIndex = parseInt(month, 10) - 1;
      const dayOfMonth = parseInt(day, 10);
      
      const date = new Date(yearAD, monthIndex, dayOfMonth);

      if (date.getFullYear() === yearAD && date.getMonth() === monthIndex && date.getDate() === dayOfMonth) {
        form.setValue("dob", date, { shouldValidate: true });
      } else {
        form.setValue("dob", undefined as any, { shouldValidate: true });
      }
    } else {
        form.clearErrors("dob");
    }
  }, [selectedDob, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    toast({
      title: "ลงทะเบียนสำเร็จ!",
      description: "ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว แล้วพบกันในกิจกรรม!",
    });
    
    form.reset();
    setSelectedDob({ day: "", month: "", year: "" });
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader className="items-center text-center">
        <Image src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp" alt="Genfosis Logo" width={150} height={159} priority className="mb-4" />
        <CardTitle className="font-headline text-3xl text-primary">ลงทะเบียนเข้าร่วมกิจกรรม</CardTitle>
        <CardDescription>กรอกข้อมูลด้านล่างเพื่อสำรองที่นั่งของคุณ</CardDescription>
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
                      <Input placeholder="สมชาย" {...field} />
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
                      <Input placeholder="รักดี" {...field} />
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
              name="dob"
              render={() => (
                <FormItem>
                  <FormLabel>วัน/เดือน/ปีเกิด</FormLabel>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <Select onValueChange={(value) => setSelectedDob(prev => ({ ...prev, day: value }))} value={selectedDob.day}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="วัน" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setSelectedDob(prev => ({ ...prev, month: value }))} value={selectedDob.month}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="เดือน" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setSelectedDob(prev => ({ ...prev, year: value }))} value={selectedDob.year}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="ปี (พ.ศ.)" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                   <FormDescription>อายุของคุณจะถูกคำนวณจากข้อมูลนี้</FormDescription>
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
                   <FormDescription>เราจะส่งผลการประเมินของคุณไปที่นี่</FormDescription>
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
