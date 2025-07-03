import { create } from 'zustand';
import type { StationKey } from './stations';

export type Scores = { [key in StationKey]?: number };

export interface Participant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageRange: string;
  phone: string;
  email: string;
  lineId?: string;
  scores: Scores;
}

// Initial mock data, to be replaced or supplemented by registration
const mockParticipantsData: Participant[] = [
    { id: 'P001', name: 'John Doe', ageRange: "20-29 ปี", gender: 'male', phone: '0812345678', email: 'john.d@example.com', scores: { pushups: 35, sit_rise: 4, sit_reach: 20, one_leg: 45, reaction: 0.3, wh_ratio: 0.48, grip: 55 }},
    { id: 'P002', name: 'Jane Smith', ageRange: "30-39 ปี", gender: 'female', phone: '0812345679', email: 'jane.s@example.com', scores: { pushups: 22, sit_rise: 3, sit_reach: 25, one_leg: 30, reaction: 0.35, wh_ratio: 0.5, grip: 40 }},
    { id: 'P003', name: 'Mike Johnson', ageRange: "40-49 ปี", gender: 'male', phone: '0812345680', email: 'mike.j@example.com', scores: { pushups: 18, sit_rise: 2, sit_reach: 15, one_leg: 20, reaction: 0.4, wh_ratio: 0.52, grip: 60 }},
];

type NewParticipantData = Omit<Participant, 'id' | 'scores'>;
type UpdateParticipantData = Partial<Omit<Participant, 'id'>>;


interface ParticipantState {
  participants: Participant[];
  addParticipant: (participant: NewParticipantData) => string;
  updateScore: (stationKey: StationKey, participantId: string, score: number) => void;
  getParticipant: (id: string) => Participant | undefined;
  updateParticipant: (participantId: string, data: UpdateParticipantData) => void;
  deleteParticipant: (participantId: string) => void;
}

// In a real app, you'd start with a higher number or fetch the last ID from a DB
let idCounter = mockParticipantsData.length;

export const useParticipants = create<ParticipantState>((set, get) => ({
  participants: mockParticipantsData,
  
  addParticipant: (participantData) => {
    idCounter++;
    const newId = `P${String(idCounter).padStart(3, '0')}`;
    const newParticipant: Participant = {
      ...participantData,
      id: newId,
      scores: {},
    };
    set((state) => ({
      participants: [...state.participants, newParticipant],
    }));
    return newId;
  },

  updateScore: (stationKey, participantId, score) => {
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id.toUpperCase() === participantId.toUpperCase()
          ? { ...p, scores: { ...p.scores, [stationKey]: score } }
          : p
      ),
    }));
  },

  getParticipant: (id: string) => {
    return get().participants.find(p => p.id.toUpperCase() === id.toUpperCase());
  },

  updateParticipant: (participantId, data) => {
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participantId
          ? { ...p, ...data, scores: { ...p.scores, ...data.scores } }
          : p
      ),
    }));
  },

  deleteParticipant: (participantId) => {
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    }));
  },
}));
