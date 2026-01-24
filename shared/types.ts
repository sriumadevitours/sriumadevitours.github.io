// Static site types - no database dependency

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  duration?: string;
  meals?: string;
  accommodation?: string;
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string;
  category: string;
  highlights: string[];
  pricePerPerson: number;
  originalPrice?: number | null;
  maxAltitude?: string | null;
  difficulty?: string | null;
  imageUrl?: string | null;
  galleryImages?: string[] | null;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  requirements?: string[] | null;
  cancellationPolicy?: string | null;
  isActive?: boolean | null;
  isFeatured?: boolean | null;
  isPremium?: boolean | null;
  sortOrder?: number | null;
}

export interface Testimonial {
  id: string;
  tourId?: string | null;
  tourName?: string | null;
  name: string;
  location?: string | null;
  rating: number;
  review: string;
  photoUrl?: string | null;
  year?: string | null;
  isApproved?: boolean | null;
  isFeatured?: boolean | null;
  createdAt?: string | null;
}
