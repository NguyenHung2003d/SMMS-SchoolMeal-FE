import { z } from "zod";

const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};
const phoneRegex = /^[0-9]+$/;
const isPhone = (value: string) => {
  return phoneRegex.test(value);
};
export const loginSchema = z.object({
  PhoneOrEmail: z.string().refine((value) => isPhone(value) || isEmail(value), {
    message: "Số điện thoại hoặc email không hợp lệ",
  }),
  password: z
    .string()
    .min(1, "Mật khẩu phải có ít nhất 6 ký tự")
    // .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
    // .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
