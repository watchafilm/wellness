
"use client";

import { useState, useEffect } from 'react';
import type { Participant } from '@/lib/data';
import { useParticipants } from '@/lib/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import { stations, StationKey } from '@/lib/stations';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ageRanges = ["20-29 ปี", "30-39 ปี", "40-49 ปี", "50-59 ปี", "60-69 ปี", "70+ ปี"] as const;
const stationKeys = Object.keys(stations) as StationKey[];

const scoreSchema = z.object(
  stationKeys.reduce((acc, key) => {
    acc[key] = z.number().optional().nullable();
    return acc;
  }, {} as Record<StationKey, z.ZodOptional<Zod.ZodNullable<Zod.ZodNumber>>>)
);

const formSchema = z.object({
  firstName: z.string().min(2, { message: "กรุณากรอกชื่อจริงอย่างน้อย 2 ตัวอักษร" }),
  lastName: z.string().min(2, { message: "กรุณากรอกนามสกุลอย่างน้อย 2 ตัวอักษร" }),
  gender: z.enum(["male", "female"]),
  ageRange: z.enum(ageRanges),
  phone: z.string().regex(/^(0\d{9})$/, { message: "กรุณากรอกเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง" }),
  email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
  lineId: z.string().optional(),
  scores: scoreSchema,
});

export default function ParticipantsPage() {
  const { participants, updateParticipant, deleteParticipant, loading } = useParticipants();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      phone: "",
      email: "",
      lineId: "",
      scores: {},
    },
  });

  useEffect(() => {
    if (selectedParticipant) {
      const nameParts = selectedParticipant.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      form.reset({
        firstName,
        lastName,
        gender: selectedParticipant.gender,
        ageRange: selectedParticipant.ageRange,
        phone: selectedParticipant.phone,
        email: selectedParticipant.email,
        lineId: selectedParticipant.lineId || "",
        scores: selectedParticipant.scores || {},
      });
    }
  }, [selectedParticipant, form]);

  const handleEditClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (participantId: string) => {
    deleteParticipant(participantId);
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedParticipant) return;

    updateParticipant(selectedParticipant.id, {
      name: `${values.firstName} ${values.lastName}`,
      gender: values.gender,
      ageRange: values.ageRange,
      phone: values.phone,
      email: values.email,
      lineId: values.lineId,
      scores: values.scores,
    });
    
    setIsEditDialogOpen(false);
    setSelectedParticipant(null);
  }

  return (
    <>
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Participants List</CardTitle>
          <CardDescription>A list of all registered participants in the event.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.ageRange}</TableCell>
                    <TableCell className="capitalize">{p.gender}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(p)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the participant
                                and all their associated scores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Participant</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
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
                      <FormLabel>Age Range</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {ageRanges.map(range => (<SelectItem key={range} value={range}>{range}</SelectItem>
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
                  render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}
                />
                <FormField
                  control={form.control}
                  name="lineId"
                  render={({ field }) => (<FormItem><FormLabel>LINE ID (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}
                />
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stationKeys.map((key) => {
                    const station = stations[key];
                    return (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`scores.${key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">{station.name}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                placeholder={station.unit}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-4 pr-0">
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
