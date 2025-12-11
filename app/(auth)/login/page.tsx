"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLoginForm } from "@/schema/LoginForm";
import { LoginFormData } from "@/types/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth({ enabled: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onLoginSubmit = (data: LoginFormData) => {
    login(data, rememberMe);
  };

  return (
    <div className="w-full min-h-screen overflow-hidden from-slate-50 via-white to-blue-50 pt-25 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full">
        <div className="bg-muted relative hidden md:block md:col-span-7 w-full h-full">
          <Image
            fill
            src={"/anh_login.jpg"}
            sizes="(max-width: 768px) 100vw, 70vw"
            alt="Image"
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-center md:p-8 h-full w-full relative z-10 md:col-span-5">
          <div className="space-y-8 w-full max-w-md">
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
                      className={`h-12 border-2 rounded-lg ${
                        errors.PhoneOrEmail
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-orange-200 focus:border-orange-400"
                      }`}
                    />
                    {errors.PhoneOrEmail && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.PhoneOrEmail.message}
                      </p>
                    )}
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
                        className={`h-12 border-2 rounded-lg pr-10 ${
                          errors.password
                            ? "border-red-500 focus:border-red-500 bg-red-50"
                            : "border-orange-200 focus:border-orange-400"
                        }`}
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
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.password.message}
                      </p>
                    )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
