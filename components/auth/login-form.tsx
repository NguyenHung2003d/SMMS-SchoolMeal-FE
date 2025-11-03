"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { auth } from "@/configs/firebaseConfig";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

interface LoginFormProps {
  mode?: "login" | "reset"; // ✅ Thêm mode
}

export default function LoginForm({ mode = "login" }: LoginFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // ✅ Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified ✅"),
        }
      );
    }
    return window.recaptchaVerifier;
  };

  // ✅ Gửi OTP cho cả login & reset password
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
      setIsOtpStep(true);
      toast.success("OTP đã được gửi đến điện thoại của bạn!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Không thể gửi OTP. Kiểm tra cấu hình Firebase hoặc domain.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ✅ Xác minh OTP cho cả 2 mode
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

      if (mode === "reset") {
        toast.success("Xác minh OTP thành công! Hãy nhập mật khẩu mới.");
        router.push("/reset-password");
      } else {
        toast.success("Đăng nhập thành công!");
        router.push("/parent");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg border border-orange-100">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full mb-4 shadow-md animate-bounce">
          <span className="text-3xl">{mode === "login" ? "🍱" : "🔐"}</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          {mode === "login" ? "Đăng nhập" : "Quên mật khẩu"}
        </h1>
        <p className="text-sm text-gray-600">
          {!isOtpStep
            ? mode === "login"
              ? "Nhập số điện thoại và mật khẩu để nhận mã OTP"
              : "Nhập số điện thoại để nhận mã OTP đặt lại mật khẩu"
            : "Nhập mã OTP vừa được gửi đến điện thoại của bạn"}
        </p>
      </div>

      <div id="recaptcha-container"></div>

      {/* Bước nhập số điện thoại */}
      {!isOtpStep && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+84xxxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg bg-white"
            />
          </div>

          {mode === "login" && (
            <>
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg bg-white"
                />
              </div>
              <div>
                
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isSendingOtp}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isSendingOtp
              ? "Đang gửi OTP..."
              : mode === "login"
              ? "Đăng nhập"
              : "Gửi mã OTP"}
          </Button>
        </form>
      )}

      {/* Bước OTP */}
      {isOtpStep && (
        <div className="space-y-5">
          <div>
            <Label
              htmlFor="otp"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Nhập mã OTP
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="Mã gồm 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-12 border-2 border-orange-200 focus:border-orange-400 rounded-lg bg-white"
            />
          </div>

          <Button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isVerifying}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            {isVerifying ? "Đang xác minh..." : "Xác minh OTP"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Không nhận được mã?{" "}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              {isSendingOtp ? "Đang gửi lại..." : "Gửi lại"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
