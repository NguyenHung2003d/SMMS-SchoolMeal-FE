"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/configs/firebaseConfig";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  ConfirmationResult,
} from "firebase/auth";
// import { useResetPasswordMutation } from "@/hooks/auth/useResetPasswordMutation"; // Bạn sẽ cần tạo hook này

// Bỏ prop 'mode'
export default function ForgotPasswordForm() {
  const router = useRouter();

  // State cho logic OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // <-- State cho mật khẩu mới
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // State cho các bước
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // <-- State mới (đã xác minh OTP)

  // State loading
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // <-- State mới

  // Hook gọi API POST /api/auth/reset-password
  // const { mutate: resetPassword } = useResetPasswordMutation();

  /** 🧩 Setup reCAPTCHA */
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container", // Đảm bảo ID này tồn tại
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified ✅"),
        }
      );
    }
    return window.recaptchaVerifier;
  };

  /** 📨 Gửi OTP (Firebase) */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Vui lòng nhập số điện thoại");

    try {
      setIsSendingOtp(true);
      const appVerifier = setupRecaptcha();
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+84${phoneNumber.slice(1)}`;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      setConfirmationResult(result);
      setIsOtpSent(true); // <-- Chuyển sang bước nhập OTP
      toast.success("OTP đã được gửi đến điện thoại của bạn!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Không thể gửi OTP. Vui lòng thử lại.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  /** ✅ Xác minh OTP (Firebase) */
  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }
    try {
      setIsVerifying(true);
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );
      // Xác minh với Firebase
      await signInWithCredential(auth, credential);

      // KHÔNG đăng nhập, chỉ chuyển sang bước nhập MK mới
      toast.success("Xác minh thành công. Vui lòng nhập mật khẩu mới.");
      setIsVerified(true); // <-- Chuyển sang bước 3
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsVerifying(false);
    }
  };

  /** 🔐 Đặt lại Mật khẩu (Gọi API Backend) */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Vui lòng nhập mật khẩu mới");

    setIsResetting(true);
    // Dùng hook mutation của bạn ở đây
    // resetPassword(
    //   { phone: phoneNumber, newPassword: newPassword },
    //   {
    //     onSuccess: () => {
    //       toast.success("Đặt lại mật khẩu thành công!");
    //       router.push("/login");
    //     },
    //     onError: (err: any) => {
    //       toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
    //       setIsResetting(false);
    //     },
    //   }
    // );
    
    // Giả lập API call
    console.log("Gọi API Backend:", { phoneNumber, newPassword });
    await new Promise(res => setTimeout(res, 1000));
    toast.success("Đặt lại mật khẩu thành công!");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 pt-8 pb-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg border border-orange-100">
      {/* Container cho reCAPTCHA vô hình */}
      <div id="recaptcha-container"></div>

      {/* Header (Cố định) */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full mb-4 shadow-md">
          <span className="text-3xl">🔐</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          Quên mật khẩu
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed px-4">
          {/* Thay đổi text theo từng bước */}
          {!isVerified
            ? "Nhập SĐT để nhận mã OTP xác minh"
            : "Đã xác minh! Nhập mật khẩu mới của bạn."}
        </p>
      </div>

      {/* FORM QUÊN MẬT KHẨU */}
      <div className="space-y-6 bg-white/60 p-6 rounded-xl backdrop-blur-sm shadow-inner">
        
        {/* Bước 1: Nhập SĐT (Chưa gửi OTP & Chưa xác minh) */}
        {!isOtpSent && !isVerified && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+84xxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={isSendingOtp}
              className="w-full h-12 bg-orange-500 text-white"
            >
              {isSendingOtp ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </form>
        )}

        {/* Bước 2: Nhập OTP (Đã gửi OTP & Chưa xác minh) */}
        {isOtpSent && !isVerified && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Nhập mã OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Mã gồm 6 số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
              />
            </div>
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full h-12 bg-green-500 text-white"
            >
              {isVerifying ? "Đang xác minh..." : "Xác minh OTP"}
            </Button>
            <p className="text-center text-sm text-gray-500">
              Không nhận được mã?{" "}
              <button
                type="button"
                onClick={handleSendOtp} // Gửi lại
                disabled={isSendingOtp}
                className="text-orange-600 font-semibold"
              >
                {isSendingOtp ? "Đang gửi lại..." : "Gửi lại"}
              </button>
            </p>
          </div>
        )}

        {/* Bước 3: Nhập Mật khẩu mới (Đã xác minh) */}
        {isVerified && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={isResetting}
              className="w-full h-12 bg-orange-500 text-white"
            >
              {isResetting ? "Đang lưu..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}

        {/* Link quay lại Đăng nhập */}
        <p className="text-center text-sm text-gray-500 pt-2">
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}