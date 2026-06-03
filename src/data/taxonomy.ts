import type { CategoryId } from '@/features/providers/types';

export type CategoryMeta = {
  id: CategoryId;
  icon: string;
  color: string;
};

export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'cardiology', icon: 'heart-pulse', color: '#E5484D' },
  { id: 'dermatology', icon: 'face-woman-shimmer', color: '#F76808' },
  { id: 'dentistry', icon: 'tooth', color: '#0EA5A4' },
  { id: 'neurology', icon: 'brain', color: '#8B5CF6' },
  { id: 'orthopedics', icon: 'bone', color: '#0EA5E9' },
  { id: 'pediatrics', icon: 'baby-face-outline', color: '#EC4899' },
  { id: 'ophthalmology', icon: 'eye-outline', color: '#06B6D4' },
  { id: 'psychiatry', icon: 'head-heart-outline', color: '#10B981' },
  { id: 'gynecology', icon: 'human-pregnant', color: '#F43F5E' },
  { id: 'oncology', icon: 'ribbon', color: '#A855F7' },
  { id: 'general', icon: 'stethoscope', color: '#0E7C7B' },
] as const;

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  
  return CATEGORY_BY_ID.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export type Country = {
    code: string;
  name: string;
  flag: string;
  cities: string[];
};

export const COUNTRIES: readonly Country[] = [
  {
    code: 'TR',
    name: 'Türkiye',
    flag: '🇹🇷',
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'],
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    cities: ['London', 'Manchester', 'Birmingham'],
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Miami'],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    cities: ['Dubai', 'Abu Dhabi'],
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    cities: ['Paris', 'Lyon', 'Nice'],
  },
] as const;

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRY_BY_CODE.get(code);
}

export function getCitiesForCountry(code: string | null | undefined): string[] {
  return getCountry(code)?.cities ?? [];
}
