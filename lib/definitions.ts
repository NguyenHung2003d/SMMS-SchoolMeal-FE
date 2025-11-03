import { z } from "zod";


export const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
    .max(12, "Số điện thoại không được quá 12 chữ số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
