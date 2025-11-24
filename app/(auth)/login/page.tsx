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
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const { register, handleSubmit } = useLoginForm();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onLoginSubmit = (data: LoginFormData) => {
    login(data, rememberMe, {
      onSuccess: (res) => {
        const userRole = res?.user?.role;
        const normalizedRole = userRole ? userRole.toLowerCase() : "";

        if (res.requirePasswordReset) {
          toast.error(
            "Bạn đang dùng mật khẩu mặc định, vui lòng đổi mật khẩu."
          );
          router.push(`/reset-password?phone=${data.PhoneOrEmail}`);
          return;
        }

        if (normalizedRole === "manager" || normalizedRole === "admin") {
          toast.success(`Xin chào quản lý: ${res?.user?.fullName}`);
          router.push("/manager/dashboard");
        } else {
          toast.success("Đăng nhập thành công!");
          setTimeout(() => router.push("/parent"), 500);
        }
      },

      onError: (error: any) => {
        let message = "Đã xảy ra lỗi. Vui lòng thử lại.";

        if (error.response) {
          message =
            error.response.data?.message ||
            error.response.data?.error ||
            `Lỗi server (${error.response.status})`;
        } else if (error.request) {
          message = "Không thể kết nối đến máy chủ. Kiểm tra mạng.";
        } else {
          message = error.message || "Lỗi không xác định.";
        }

        toast.error(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/10 p-8">
          <div className="pt-10 flex items-center justify-center p-2">
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

                  <form
                    onSubmit={handleSubmit(onLoginSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label
                        htmlFor="PhoneOrEmail"
                        className="text-gray-700 font-semibold text-sm flex items-center gap-2"
                      >
                        <Mail size={16} className="text-orange-500" />
                        Email hoặc Số điện thoại
                      </Label>

                      <Input
                        id="PhoneOrEmail"
                        type="text"
                        placeholder="Nhập email hoặc số điện thoại"
                        {...register("PhoneOrEmail")}
                        className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-semibold text-sm flex items-center gap-2"
                      >
                        <Lock size={16} className="text-orange-500" />
                        Mật khẩu
                      </Label>

                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          {...register("password")}
                          className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg pr-10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm text-gray-600 cursor-pointer font-medium"
                        >
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                    </div>

                    <div className="text-right">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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

                  <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400 font-medium">
                      HOẶC
                    </span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <p className="text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                      href="/register"
                      className="text-orange-600 hover:text-orange-700 font-bold hover:underline"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
