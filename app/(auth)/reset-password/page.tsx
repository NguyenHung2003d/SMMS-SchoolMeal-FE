"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance"; // Đảm bảo đường dẫn đúng
import { Eye, EyeOff, Lock, Mail, KeyRound } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phoneOrEmailFromUrl = searchParams.get("phone") || "";

  const [formData, setFormData] = useState({
    email: phoneOrEmailFromUrl,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phoneOrEmailFromUrl) {
      setFormData((prev) => ({ ...prev, email: phoneOrEmailFromUrl }));
    }
  }, [phoneOrEmailFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await axiosInstance.post("/Auth/reset-first-password", payload);

      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      router.push("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Đổi mật khẩu thất bại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đổi mật khẩu lần đầu
          </h2>
          <p className="text-sm text-gray-500">
            Để bảo mật, vui lòng thay đổi mật khẩu mặc định.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Mail size={16} className="text-orange-500" /> Tài khoản
            </Label>
            <Input
              id="email"
              value={formData.email}
              readOnly
              disabled
              className="bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <KeyRound size={16} className="text-orange-500" /> Mật khẩu hiện
              tại
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword.current ? "text" : "password"}
                placeholder="Nhập mật khẩu cũ (ví dụ: @1)"
                value={formData.currentPassword}
                onChange={handleChange}
                className="pr-10 border-orange-200 focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Lock size={16} className="text-orange-500" /> Mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword.new ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                className="pr-10 border-orange-200 focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmNewPassword"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Lock size={16} className="text-orange-500" /> Xác nhận mật khẩu
              mới
            </Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="pr-10 border-orange-200 focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Đang tải...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
