// data.ts

export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  roles: string[];
  workplace: string;
}

export const doctorsData: Doctor[] = [
  // ————————————————
  // 1. PGS, TS
  // ————————————————
  {
    id: "5",
    name: "Nguyễn Thị Trang",
    title: "PGS, TS",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp98JOL-9ZyHndeKZe6NByRpG6LAcasH82oQ&s",
    workplace: "Đại học Y Hà Nội",
    roles: [
      "Giảng viên cao cấp Trường Đại học Y Hà Nội",
      "Hội Di truyền y học Việt Nam"
    ],
  },

  // ————————————————
  // 2. TS, BS (nhóm nhiều nhất)
  // ————————————————
  {
    id: "1",
    name: "Hồ Kim Châu",
    title: "Tiến sĩ, Bác sĩ",
    image: "https://genlab.vn/wp-content/uploads/2020/05/bs-chau-genlab.jpg",
    workplace: "Đại học Kiểm sát Hà Nội, Viện PYQG",
    roles: [
      "Giảng viên cao cấp Trường Đại học Kiểm sát Hà Nội",
      "Nguyên Trưởng khoa Giám định Viện PYQG",
      "Nguyên Giám định viên Viện Khoa học Hình sự",
    ],
  },
  {
    id: "2",
    name: "Hồ Quang Huy",
    title: "Tiến sĩ, Bác sĩ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0o-UxLtp_LxL87CURavmDQ7v9fLGPca_5Q&s",
    workplace: "Bệnh viện K cơ sở 2",
    roles: ["Phụ trách Khoa xét nghiệm (Bệnh viện K cơ sở 2)"],
  },
  {
    id: "4",
    name: "Đoàn Trọng Tuyên",
    title: "Tiến sĩ, Bác sĩ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbLRQ2v4uT6rWB3PtLpp-9FJPf7Y_uzqbdZQ&s",
    workplace: "Viện y học dự phòng Quân đội",
    roles: [
      "Nguyên Phó Viện trưởng Viện y học dự phòng Quân đội - Cục Quân Y"
    ],
  },
  {
    id: "6",
    name: "Bùi Kiều Yến Trang",
    title: "Tiến sĩ, Bác sĩ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZlvSq_ztecCuR4Kxq85-mbuJRGBpofg_7SA&s",
    workplace: "Bệnh viện Từ Dũ",
    roles: ["Bác sĩ di truyền (Bệnh viện Từ Dũ)"],
  },

  // ————————————————
  // 3. ThS, BS
  // ————————————————
  {
    id: "3",
    name: "Trần Hồng Vân",
    title: "Thạc sĩ, Bác sĩ",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_wJkS5Wkb5TsNMelXB-tOoXQo_fthKpuRQ&s",
    workplace: "Bệnh viện Đại học Y Hà Nội",
    roles: ["Phó trưởng Khoa xét nghiệm", "Bệnh viện Đại học Y Hà Nội"],
  },
];
