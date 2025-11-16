export type Teacher = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classAssigned: string;
  avatar: string;
  status: "active" | "inactive" | "onLeave";
};
