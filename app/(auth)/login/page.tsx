"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
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
  const { register, handleSubmit } = useLoginForm();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        leftSideRef.current,
        { xPercent: -100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          imageRef.current,
          { scale: 1.3 },
          { scale: 1, duration: 2.5 },
          "-=1"
        )
        .from(
          ".left-content > *",
          {
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
          },
          "-=1.5"
        )

        .from(
          ".form-element",
          {
            x: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            clearProps: "all",
          },
          "-=1"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const onLoginSubmit = (data: LoginFormData) => {
    login(data, rememberMe);
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex bg-[#FDFCFB] overflow-hidden font-sans"
    >
      <div
        ref={leftSideRef}
        className="hidden lg:flex lg:w-3/5 relative items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-green-800/40 via-transparent to-orange-500/20 z-10" />

        <div className="absolute bottom-16 left-16 z-20 text-white space-y-6 max-w-xl left-content">
          <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
            Chăm sóc con <br />
            <span className="text-orange-400 italic">từng bữa ăn trường.</span>
          </h1>
          <p className="text-white/80 text-xl font-medium leading-relaxed">
            Nơi phụ huynh gửi trọn niềm tin vào thực đơn dinh dưỡng và chất
            lượng vệ sinh an toàn thực phẩm.
          </p>
        </div>

        <div ref={imageRef} className="absolute inset-0 w-full h-full">
          <Image
            fill
            src="/anh_login.jpg"
            alt="School Lunch"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-12 bg-white relative z-20">
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-3">
            <h2 className="form-element text-4xl font-extrabold text-slate-900 tracking-tight">
              Chào Ba Mẹ,
            </h2>
            <p className="form-element text-slate-500 font-medium">
              Đăng nhập để theo dõi hành trình dinh dưỡng của con yêu hôm nay.
            </p>
          </div>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
            <div className="form-element space-y-2.5">
              <Label
                htmlFor="PhoneOrEmail"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Tài khoản của bạn
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="PhoneOrEmail"
                  placeholder="Email hoặc số điện thoại"
                  {...register("PhoneOrEmail")}
                  className="pl-11 h-13 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                />
              </div>
            </div>

            <div className="form-element space-y-2.5">
              <Label
                htmlFor="password"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Mật khẩu
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-11 pr-12 h-13 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-element flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border-2 border-slate-200 text-green-600 focus:ring-green-500 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2.5 text-sm font-semibold text-slate-600 group-hover:text-green-700 transition-colors">
                  Ghi nhớ tôi
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-bold text-orange-500 hover:text-orange-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoginLoading}
              className="form-element w-full h-14 text-lg bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 group"
            >
              {isLoginLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang kết nối...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Bắt đầu giám sát bữa ăn</span>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
