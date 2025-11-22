"use client";

import React, { useState } from "react";
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
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const { register, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

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
          console.log(res);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pt-15 flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 p-4">
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đăng nhập
              </h2>
              <p className="text-sm text-gray-500">
                Quản lý bữa ăn của con bạn
              </p>
            </div>

            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="PhoneOrEmail"
                  className="text-gray-700 font-semibold text-sm flex items-center gap-2"
                >
                  <Mail size={16} className="text-orange-500" />
                  Email hoặc Số điện thoại
                </Label>
                <div className="relative group">
                  <Input
                    id="PhoneOrEmail"
                    type="text"
                    placeholder="Nhập email hoặc số điện thoại"
                    {...register("PhoneOrEmail")}
                    className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-semibold text-sm flex items-center gap-2"
                >
                  <Lock size={16} className="text-orange-500" />
                  Mật khẩu
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    {...register("password")}
                    className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors duration-200 p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoginLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-base"
              >
                {isLoginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-bold transition-colors hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
