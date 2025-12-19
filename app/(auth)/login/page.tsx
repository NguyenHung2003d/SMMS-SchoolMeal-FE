"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLoginForm } from "@/schema/LoginForm";
import { LoginFormData } from "@/types/auth";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ChevronRight,
  Apple,
  Utensils,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="w-full min-h-screen flex bg-[#FDFCFB] overflow-hidden font-sans mt-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-3/5 relative items-center justify-center overflow-hidden"
      >
        <div className="absolute bottom-16 left-16 z-20 text-white space-y-6 max-w-xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
              Dinh dưỡng trọn vẹn <br />
              <span className="text-orange-400">Gói trọn yêu thương.</span>
            </h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed">
              Hệ thống theo dõi thực đơn và chất lượng bữa ăn mỗi ngày, giúp cha
              mẹ an tâm về sự phát triển thể chất của con tại trường.
            </p>
          </motion.div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">100%</span>
              <span className="text-white/70 text-sm font-medium">
                An toàn thực phẩm
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold">Menu</span>
              <span className="text-white/70 text-sm font-medium">
                Cập nhật hàng tuần
              </span>
            </div>
          </div>
        </div>

        <Image
          fill
          src="/anh_login.jpg"
          alt="School Lunch Background"
          className="object-cover w-full h-full scale-105"
          priority
        />
      </motion.div>
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12 bg-white relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-10 relative z-10"
        >
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Cổng thông tin Phụ huynh
            </h2>
            <p className="text-slate-500 font-medium">
              Đăng nhập để xem thực đơn và nạp tiền bữa ăn cho con.
            </p>
          </div>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
            <div className="space-y-2.5">
              <Label
                htmlFor="PhoneOrEmail"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Tài khoản Phụ huynh
              </Label>
              <div className="relative group transition-all">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="PhoneOrEmail"
                  placeholder="Email hoặc số điện thoại đăng ký"
                  {...register("PhoneOrEmail")}
                  className={`pl-11 h-13 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 transition-all duration-300 ${
                    errors.PhoneOrEmail
                      ? "border-red-400 bg-red-50/30"
                      : "hover:border-green-200 focus:border-green-600"
                  }`}
                />
              </div>
              {errors.PhoneOrEmail && (
                <p className="text-red-500 text-xs font-medium mt-1 ml-2">
                  {errors.PhoneOrEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700"
                >
                  Mật khẩu
                </Label>
              </div>
              <div className="relative group transition-all">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-11 pr-12 h-13 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 transition-all duration-300 ${
                    errors.password
                      ? "border-red-400 bg-red-50/30"
                      : "hover:border-green-200 focus:border-green-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1 ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:border-green-600 checked:bg-green-600 transition-all"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <svg
                    className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="ml-2.5 text-sm font-semibold text-slate-600 group-hover:text-green-700 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>

              <Link
                href="/forgot-password"
                title="Quên mật khẩu"
                className="text-sm font-bold text-green-600 hover:text-green-700"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 group"
            >
              {isLoginLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Vào quản lý bữa ăn</span>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
