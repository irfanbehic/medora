export type ProviderKind = 'doctor' | 'clinic' | 'hospital';

export type CategoryId =
  | 'cardiology'
  | 'dermatology'
  | 'dentistry'
  | 'neurology'
  | 'orthopedics'
  | 'pediatrics'
  | 'ophthalmology'
  | 'psychiatry'
  | 'gynecology'
  | 'oncology'
  | 'general';

export type RatingBreakdown = readonly [number, number, number, number, number];

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
    date: string;
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type Provider = {
  id: string;
  name: string;
  kind: ProviderKind;
  category: CategoryId;

    photo?: string | null;
    blurhash?: string;

    rating?: number | null;
  reviewCount?: number;
  ratingBreakdown?: RatingBreakdown;

    countryCode: string;
  city?: string | null;
  address?: string | null;

  experienceYears?: number;
  patientsServed?: number;
  verified: boolean;

  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  languages?: string[];

  coordinate?: GeoPoint;
  reviews?: Review[];
};

export type ProviderFilters = {
  search?: string;
  countryCode?: string | null;
  city?: string | null;
  categories?: CategoryId[];
};
