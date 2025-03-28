import { EventForServer, EventTimeline, Speaker } from "@/types";
import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Event = {
  speakerId?: string;
  id: string;
  docId?: string;
  title: string;
  description?: string;
  date: string | Timestamp | { seconds: number } | null;
  location?: string;
  eventRoom?: string;
  images?: string[];
  author?: string;
  parking?: boolean;
  seats?: string;
  snacks?: boolean;
  imageUrls: string[];
  speakers?: Speaker[];
  schedule?: EventTimeline[];
  maxSeats?: number;
  registeredCount?: number;
  rawDate?: Date;
  formattedDate?: string;
  registrationId?: string;
};

export const pastEventsAtom = atom<Event[]>({
  key: "pastEventsAtom",
  default: [],
});

export const upcomingEventsAtom = atom<Event[]>({
  key: "upcomingEventsAtom",
  default: [],
});

export const eventCacheAtom = atom<Record<string, EventForServer>>({
  key: 'eventCache',
  default: {} 
});
