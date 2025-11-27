// data/clinics.ts
import { Clinic } from "@/types/clinic";

export const clinicData: Clinic[] = [
  {
    id: 1,
    clinicId: "GOLAB-HADONG",
    name: "Trung tâm xét nghiệm GoLAB Hà Đông",
    address: "🌏 Số 12 Trần Phú, Quận Hà Đông, Hà Nội",
    rating: 4.9,
    image:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1749612460/z6674380613577_c572589ba63f26fc2af0b67297145ffb_zl05sn.jpg",
    descriptions: [
      "GoLAB là hệ thống phòng xét nghiệm hiện đại",
      "trải dài khắp cả nước.",
      "Ứng dụng công nghệ xét nghiệm tự động và kỹ thuật tiên tiến.",
      "Đội ngũ chuyên gia và kỹ thuật viên giàu kinh nghiệm.",
      "Hệ thống quản lý chất lượng theo tiêu chuẩn ISO 15189.",
      "Dịch vụ xét nghiệm đa dạng",
      "phục vụ từ cơ bản đến chuyên sâu.",
      "GoLAB Hà Đông mang đến dịch vụ xét nghiệm chính xác",
      "nhanh chóng và tiện lợi cho cư dân khu vực phía Tây Hà Nội.",
      "Phòng khám được đầu tư cơ sở vật chất hiện đại",
      "hệ thống máy móc đồng bộ từ các hãng hàng đầu thế giới.",
      "Đội ngũ nhân viên nhiệt tình",
      "tận tâm hỗ trợ khách hàng trong suốt quá trình sử dụng dịch vụ.",
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.123456!2d105.785000!3d20.961000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac123456789%3A0xabcdef1234567890!2zMTIgVHLhuqduIFBow7osIEjDoCDEkMO0bmcsIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1747823456789!5m2!1svi!2s",
    isVerified: true,
  },

  {
    id: 2,
    clinicId: "GOLAB-BADINH",
    name: "Phòng xét nghiệm GoLAB Ba Đình",
    address: "Số 10 Nguyễn Thái Học, Ba Đình, Hà Nội",
    rating: 4.7,
    image:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1749612708/z6674381349634_227074fb10a2fb75d4c410f85b052f3f_mmhzii.jpg",
    descriptions: [
      "Trang thiết bị hiện đại đạt chuẩn quốc tế",
      "Đội ngũ y bác sĩ giàu kinh nghiệm và chuyên môn cao",
      "Quy trình lấy mẫu nhanh chóng – trả kết quả trong ngày",
      "Hệ thống quản lý kết quả xét nghiệm điện tử thông minh",
      "Chăm sóc khách hàng tận tình",
      "hỗ trợ tư vấn 24/7",
      "Phòng xét nghiệm GoLAB Ba Đình là cơ sở trực thuộc hệ thống GoLAB",
      "chuyên cung cấp các dịch vụ xét nghiệm máu",
      "sinh hóa",
      "miễn dịch",
      "vi sinh và tầm soát sức khỏe.",
      "Trung tâm được trang bị các thiết bị hiện đại từ châu Âu và Mỹ",
      "đảm bảo độ chính xác cao trong từng xét nghiệm.",
      "GoLAB cam kết mang đến trải nghiệm thân thiện",
      "chuyên nghiệp và nhanh chóng cho mọi khách hàng đến thăm khám.",
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.107876129868!2d105.83921697476919!3d21.028369187792958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab97766545af%3A0x6a7df64f42dca7a5!2zMjkvMTAgUC4gTmd1eeG7hW4gVGjDoWkgSOG7jWMsIFThu5UgNStU4buVIDYrVOG7lSwgQmEgxJDDrG5oLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1747983998436!5m2!1svi!2sus",
    isVerified: true,
  },

  {
    id: 3,
    clinicId: "GOLAB-VINHYEN",
    name: "Phòng xét nghiệm GoLab Vĩnh Yên",
    address:
      "Đinh Tiên Hoàng, Khai Quang, Vĩnh Yên, Vĩnh Phúc, Việt Nam",
    rating: 4.8,
    image:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1749612871/z6674373440424_935f4f7acd7b25af4a97df4fb6a21892_pubbey.jpg",
    descriptions: [
      "Đội ngũ chuyên gia xét nghiệm trình độ cao",
      "tận tâm.",
      "Trang thiết bị hiện đại chuẩn quốc tế ISO 15189.",
      "Quy trình lấy mẫu và trả kết quả nhanh chóng",
      "bảo mật.",
      "Tiện lợi với nhiều dịch vụ xét nghiệm tại nhà.",
      "Kết quả chính xác",
      "tư vấn chuyên sâu từ bác sĩ.",
      "Phòng xét nghiệm GoLAB Vĩnh Yên là cơ sở trực thuộc hệ thống GoLABchuyên cung cấp các dịch vụ xét nghiệm máusinh hóamiễn dịchvi sinh và tầm soát sức khỏe.Trung tâm được trang bị các thiết bị hiện đại từ châu Âu và Mỹđảm bảo độ chính xác cao trong từng xét nghiệm.GoLAB cam kết mang đến trải nghiệm thân thiệnchuyên nghiệp và nhanh chóng cho mọi khách hàng đến thăm khám.",
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42060.47479007037!2d105.58442124515899!3d21.285085483206796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fab93ac6aaab%3A0x7bd1cb3b216fd9b1!2sHeron%20Lake%20Golf%20Course%20%26%20Resort!5e0!3m2!1svi!2s!4v1749613166239!5m2!1svi!2s",
    isVerified: true,
  },

  {
    id: 4,
    clinicId: "GOLAB-HOABINH",
    name: "Trung tâm xét nghiệm GoLAB Hòa Bình",
    address:
      "Tầng 3, Số 83 Cù Chính Lan, phường Đồng Tiến, TP Hòa Bỉnh,  Tỉnh Hòa Bình, Hòa Bình",
    rating: 5,
    image:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1749614836/z6674375211875_a5f308fd2e2b12765bf4c2730ff7f2af_dpsxic.jpg",
    descriptions: [
      "GoLAB là hệ thống phòng xét nghiệm hiện đại",
      "trải dài khắp cả nước.",
      "Ứng dụng công nghệ xét nghiệm tự động và kỹ thuật tiên tiến.",
      "Đội ngũ chuyên gia và kỹ thuật viên giàu kinh nghiệm.",
      "Hệ thống quản lý chất lượng theo tiêu chuẩn ISO 15189.",
      "Dịch vụ xét nghiệm đa dạng",
      "phục vụ từ cơ bản đến chuyên sâu.",
      "GoLAB Hòa Bình mang đến dịch vụ xét nghiệm chính xác",
      "nhanh chóng và tiện lợi cho cư dân khu vực phía Tây Hà Nội.",
      "Phòng khám được đầu tư cơ sở vật chất hiện đại",
      "hệ thống máy móc đồng bộ từ các hãng hàng đầu thế giới.",
      "Đội ngũ nhân viên nhiệt tình",
      "tận tâm hỗ trợ khách hàng trong suốt quá trình sử dụng dịch vụ.",
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3729.0503177522273!2d105.35492687476405!3d20.82967449458761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31346bacfb93910b%3A0x7e42a6e7587a2f5!2zODMgQ8O5IENow61uaCBMYW4sIMSQ4buTbmcgVMOqbiwgSMOyYSBCw6xuaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1749615014969!5m2!1svi!2s",
    isVerified: true,
  },
];
