export interface Clinic {
  id: number;
  clinicId: string;
  name: string;
  address: string;
  image: string;
  descriptions: string[];
  mapEmbedUrl?: string;
  isVerified: boolean;
  timeWork: string; // Trường mới
  dateWork: string; // Trường mới
  phoneNumber: string; // Trường mới
  // Đã xóa rating
}
