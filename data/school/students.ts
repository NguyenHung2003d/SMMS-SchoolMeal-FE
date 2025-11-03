import { Student } from "@/types";

export const studentsData: Student[] = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    avatar: "https://i.imgur.com/wgJDypg.jpg",
    gender: "Nữ",
    birthdate: "2017-08-15",
    class: "1A",
    parent: {
      name: "Nguyễn Văn A",
      phone: "0912345678",
      email: "parentA@gmail.com",
      hasAccount: true,
    },
    status: "active",
    note: "Dị ứng với sữa",
  },
  {
    id: 2,
    name: "Trần Hoàng Nam",
    avatar: "https://i.imgur.com/8RWKYSf.jpg",
    gender: "Nam",
    birthdate: "2017-05-20",
    class: "1A",
    parent: {
      name: "Trần Văn B",
      phone: "0923456789",
      email: "parentB@gmail.com",
      hasAccount: false,
    },
    status: "active",
  },
];

export const initialStudents = [
  {
    id: 1,
    classId: 1,
    name: "Nguyễn Minh Huy",
    gender: "Nam",
    dob: "2015-05-10",
    parentName: "Nguyễn Văn X",
  },
  {
    id: 2,
    classId: 1,
    name: "Trần Thị Hoa",
    gender: "Nữ",
    dob: "2015-08-15",
    parentName: "Trần Thị Y",
  },
  {
    id: 3,
    classId: 1,
    name: "Lê Hoàng Minh",
    gender: "Nam",
    dob: "2015-03-20",
    parentName: "Lê Văn Z",
  },
  {
    id: 4,
    classId: 2,
    name: "Phạm Văn Hùng",
    gender: "Nam",
    dob: "2014-11-08",
    parentName: "Phạm Văn M",
  },
];
