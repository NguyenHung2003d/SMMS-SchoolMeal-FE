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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified"),
        }
      );
    }
    return window.recaptchaVerifier;
  };

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
      setIsOtpSent(true);
      toast.success("OTP đã được gửi!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Không thể gửi OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

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

      await signInWithCredential(auth, credential);

      toast.success("Xác minh OTP thành công!");
      setIsVerified(true);
    } catch (error) {
      toast.error("Mã OTP không hợp lệ");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) return toast.error("Vui lòng nhập mật khẩu mới");

    setIsResetting(true);

    console.log("Gửi API Reset Password:", { phone: phoneNumber, newPassword });

    await new Promise((res) => setTimeout(res, 1000));

    toast.success("Đặt lại mật khẩu thành công!");
    return router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/10 p-8">
          <div id="recaptcha-container"></div>

          <div className="w-full max-w-md mx-auto pt-2 pb-4">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full mb-4 shadow-md">
                <span className="text-3xl">🔐</span>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                Quên mật khẩu
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed px-4">
                {!isVerified
                  ? "Nhập SĐT để nhận mã OTP xác minh"
                  : "Nhập mật khẩu mới của bạn"}
              </p>
            </div>

            <div className="space-y-6 bg-white/60 p-6 rounded-xl backdrop-blur-sm shadow-inner">
              {!isOtpSent && !isVerified && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input
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

              {isOtpSent && !isVerified && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mã OTP</Label>
                    <Input
                      type="text"
                      placeholder="6 số"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-full h-12 bg-green-500 text-white"
                  >
                    {isVerifying ? "Đang xác minh..." : "Xác minh OTP"}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Không nhận được mã?{" "}
                    <button
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="text-orange-600 font-semibold"
                    >
                      {isSendingOtp ? "Đang gửi..." : "Gửi lại"}
                    </button>
                  </p>
                </div>
              )}

              {isVerified && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mật khẩu mới</Label>
                    <Input
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

              <p className="text-center text-sm text-gray-500 pt-2">
                <Link href="/login" className="text-orange-600 font-semibold">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
