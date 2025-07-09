
"use client";

import { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
  query,
  type DocumentData,
} from 'firebase/firestore';
import type { StationKey } from './stations';
import { useToast } from '@/hooks/use-toast';
import { stations } from './stations';

export type Scores = { [key in StationKey]?: number };

export interface Participant {
  id: string; // P001, P002, etc.
  name: string; // Computed display name
  firstName?: string;
  lastName?: string;
  nickname?: string;
  gender: 'male' | 'female';
  ageRange: string;
  phone?: string;
  email?: string;
  lineId?: string;
  scores: Scores;
  stress?: {
    physical: number;
    mental: number;
    overall: number;
    updatedAt: number;
  };
  createdAt: number; // For ordering
}

export type NewParticipantData = Omit<Participant, 'id' | 'scores' | 'createdAt' | 'stress'>;
export type UpdateParticipantData = Partial<Omit<Participant, 'id' | 'createdAt'>>;

const PARTICIPANTS_COLLECTION = 'participants';
const COUNTER_DOC = 'counters';
const PARTICIPANT_COUNTER_ID = 'participantId';

async function getNextParticipantId(): Promise<string> {
    const counterRef = doc(db, COUNTER_DOC, PARTICIPANT_COUNTER_ID);

    try {
        const newIdNumber = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            if (!counterDoc.exists()) {
                transaction.set(counterRef, { currentId: 1 });
                return 1;
            }
            const newId = counterDoc.data().currentId + 1;
            transaction.update(counterRef, { currentId: newId });
            return newId;
        });
        return `P${String(newIdNumber).padStart(3, '0')}`;
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw new Error("Could not generate new participant ID.");
    }
}

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // The orderBy clause requires a custom Firestore index. 
    // This has been removed to prevent errors on a fresh database setup.
    // Client-side sorting is used instead to maintain order.
    const q = query(collection(db, PARTICIPANTS_COLLECTION));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const participantsData: Participant[] = [];
      querySnapshot.forEach((doc) => {
        participantsData.push({ id: doc.id, ...doc.data() } as Participant);
      });
      // Sort participants by creation time on the client-side
      participantsData.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setParticipants(participantsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching participants: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch participants data.",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addParticipant = async (participantData: NewParticipantData): Promise<string> => {
    setLoading(true);
    try {
      const newId = await getNextParticipantId();
      const newParticipant: Omit<Participant, 'id' | 'stress'> = {
        ...participantData,
        scores: {},
        createdAt: Date.now(),
      };
      await setDoc(doc(db, PARTICIPANTS_COLLECTION, newId), newParticipant);
      // Toast is now handled in the component for a better user experience
      return newId;
    } catch (error) {
      console.error("Error adding participant: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add new participant.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateParticipant = async (participantId: string, data: UpdateParticipantData) => {
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
    try {
      await updateDoc(participantRef, data);
      toast({
        title: "Participant Updated",
        description: "Participant information has been saved.",
      });
    } catch (error) {
      console.error("Error updating participant: ", error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "Could not update participant data.",
      });
    }
  };
  
  const updateScore = async (stationKey: StationKey, participantId: string, score: number) => {
      const participantRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
      const scoreField = `scores.${stationKey}`;
      const station = stations[stationKey];
      const participant = participants.find(p => p.id.toUpperCase() === participantId.toUpperCase());
      
      try {
          await updateDoc(participantRef, { [scoreField]: score });
           toast({
            title: `Score Submitted: ${station.name}`,
            description: `Participant ${participant?.name ?? participantId} scored ${score} ${station.unit}.`,
        });
      } catch (error) {
          console.error("Error updating score: ", error);
          toast({
              variant: "destructive",
              title: "Update Error",
              description: "Could not update score.",
          });
      }
  };

  const updateStressScores = async (participantId: string, physicalInput: number, mentalInput: number) => {
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
    
    const physical = 100 - physicalInput;
    const mental = 100 - mentalInput;
    const overall = (physical + mental) / 2;

    const stressData = {
        physical,
        mental,
        overall,
        updatedAt: Date.now(),
    };

    try {
        await updateDoc(participantRef, { stress: stressData });
    } catch (error) {
        console.error("Error updating stress score: ", error);
        toast({
            variant: "destructive",
            title: "Update Error",
            description: "Could not update stress score.",
        });
        throw error;
    }
  };

  const deleteParticipant = async (participantId: string) => {
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, participantId);
    try {
      await deleteDoc(participantRef);
      toast({
        title: "Participant Deleted",
        description: "The participant has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting participant: ", error);
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Could not delete participant.",
      });
    }
  };
  
  const getParticipant = (id: string): Participant | undefined => {
      return participants.find(p => p.id.toUpperCase() === id.toUpperCase());
  };

  return { participants, loading, addParticipant, updateParticipant, deleteParticipant, updateScore, getParticipant, updateStressScores };
}
