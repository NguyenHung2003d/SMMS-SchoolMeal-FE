import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/definitions";

export const useLoginForm = (options?: UseFormProps<LoginFormData>) => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      PhoneOrEmail: "",
      password: "",
    },
    mode: "onChange", 
    ...options,
  });
};
