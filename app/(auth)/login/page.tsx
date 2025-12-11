"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLoginForm } from "@/schema/LoginForm";
import { LoginFormData } from "@/types/auth";
import { Eye, EyeOff, Lock, Mail, ChevronRight } from "lucide-react";
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
    <div className="w-full min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-3/5 relative bg-orange-50 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-black/10 z-10 mix-blend-multiply" />

        <Image
          fill
          src="/anh_login.jpg"
          alt="Login Background"
          className="object-cover w-full h-full"
          priority
        />
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-white relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-orange-100 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Đăng nhập
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Nhập thông tin của bạn để truy cập hệ thống.
            </p>
          </div>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="PhoneOrEmail"
                className="text-sm font-medium text-gray-700"
              >
                Email hoặc Số điện thoại
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={20} />
                </div>
                <Input
                  id="PhoneOrEmail"
                  type="text"
                  placeholder="example@gmail.com"
                  {...register("PhoneOrEmail")}
                  className={`pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200 ${
                    errors.PhoneOrEmail
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : "focus:border-orange-500"
                  }`}
                />
              </div>
              {errors.PhoneOrEmail && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.PhoneOrEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </Label>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={20} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 pr-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : "focus:border-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
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
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Ghi nhớ
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-11 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              {isLoginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Đăng nhập
                  <ChevronRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
