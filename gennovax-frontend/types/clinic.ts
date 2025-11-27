// types/clinic.ts
export interface Clinic {
  id: number;
  clinicId: string; // Tương ứng với ID trong data gốc
  name: string;
  address: string;
  rating: number;
  image: string;
  descriptions: string[];
  mapEmbedUrl?: string;
  isVerified: boolean;
}