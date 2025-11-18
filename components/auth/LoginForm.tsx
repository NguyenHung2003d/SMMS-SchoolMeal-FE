"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { LoginFormData } from "@/types/auth";
import { AxiosError } from "axios";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const { register, handleSubmit } = useLoginForm();

  const onLoginSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (res) => {
        if (res.requirePasswordReset) {
          toast.error(
            "Bạn đang dùng mật khẩu mặc định, vui lòng đổi mật khẩu."
          );
          router.push(`/reset-password?phone=${data.PhoneOrEmail}`);
        } else {
          toast.success("Đăng nhập thành công!");
          router.push("/parent");
          router.refresh();
          console.log(res)
        }
      },
      onError: (error: AxiosError<any>) => {
        let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";

        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Lỗi server (${error.response.status})`;
        } else if (error.request) {
          errorMessage =
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.";
        } else {
          errorMessage = error.message || "Lỗi không xác định.";
        }
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 pt-8 pb-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg border border-orange-100">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full mb-4 shadow-md">
          <span className="text-3xl">🍱</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          Đăng nhập
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onLoginSubmit)}
        className="space-y-6 bg-white/60 p-6 rounded-xl backdrop-blur-sm shadow-inner"
      >
        <div className="space-y-2">
          <Label htmlFor="PhoneOrEmail">Email hoặc Số điện thoại</Label>
          <Input
            id="PhoneOrEmail"
            type="text"
            {...register("PhoneOrEmail")}
            className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoginLoading}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 pt-2">
          Quên mật khẩu?{" "}
          <Link
            href="/forgot-password"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Đặt lại mật khẩu
          </Link>
        </p>
      </form>
    </div>
  );
}
