export type PackageOption = {
  name: string;
  price: number;
};

export type PackageDetails = {
  id: string;
  name: string;
  description: string;
  targetAudience?: string; // Đối tượng
  returnTime: string; // Thời gian trả kết quả
  price: number; // Giá niêm yết
  options?: PackageOption[]; // Các tùy chọn làm thêm
  category: "NIPT" | "GENE" | "HPV" | "ADN"; // <-- Đã thêm "ADN"
};
