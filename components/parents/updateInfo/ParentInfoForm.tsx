"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Save,
  Calendar,
  X,
  UploadCloud,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { UpdatedParentInfoFormProps } from "@/types/parent";
import { toast } from "react-hot-toast";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/configs/firebaseConfig";

export function ParentInfoForm({
  parentInfo,
  isSaving,
  onInfoChange,
  onSubmit,
  onAvatarChange,
  onCancel,
}: UpdatedParentInfoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const initialPhone = useRef(parentInfo.phone);

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countdown]);

  useEffect(() => {
    if (!recaptchaVerifierRef.current && typeof window !== "undefined") {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }

    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleSendOtp = async () => {
    if (!parentInfo.phone) return toast.error("Vui lòng nhập số điện thoại");

    if (countdown > 0) {
      toast.error(`Vui lòng đợi ${countdown} giây nữa để gửi lại yêu cầu.`);
      return;
    }

    try {
      setIsVerifying(true);

      const container = document.getElementById("recaptcha-container");
      if (container) container.innerHTML = '<div id="recaptcha-element"></div>';

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-element",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        }
      );

      const formattedPhone = parentInfo.phone.startsWith("0")
        ? `+84${parentInfo.phone.slice(1)}`
        : parentInfo.phone;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setIsOtpSent(true);
      setCountdown(60);
      toast.success("Mã OTP đã được gửi");
    } catch (err: any) {
      console.error("Lỗi gửi OTP:", err);
      if (err.code === "auth/too-many-requests") {
        setCountdown(120);
        toast.error(
          "Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng đợi 2 phút để thử lại."
        );
      } else if (err.code === "auth/invalid-phone-number") {
        toast.error("Số điện thoại không hợp lệ.");
      } else {
        toast.error(`Lỗi: ${err.code || err.message}`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    try {
      setIsVerifying(true);
      await confirmationResult.confirm(otp);
      setIsPhoneVerified(true);
      setIsOtpSent(false);
      toast.success("Xác minh số điện thoại thành công!");
    } catch (error) {
      toast.error("Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }
      onAvatarChange(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    }
  };

  const hasPhoneChanged = parentInfo.phone !== initialPhone.current;

  useEffect(() => {
    if (parentInfo.phone && !initialPhone.current) {
      initialPhone.current = parentInfo.phone;
    }
  }, [parentInfo.phone]);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Chỉnh sửa thông tin
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center space-y-4 md:w-1/3">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-gray-100 relative">
                <img
                  src={
                    previewUrl ||
                    parentInfo.avatarUrl ||
                    "https://ui-avatars.com/api/?name=" + parentInfo.fullName
                  }
                  alt="avatar"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                <UploadCloud size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Nhấn vào ảnh để thay đổi
              <br />
              (Tối đa 5MB)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 space-y-5">
            <InputField
              icon={<User size={18} />}
              label="Họ và tên"
              name="fullName"
              value={parentInfo.fullName || ""}
              onChange={onInfoChange}
              placeholder="Nhập họ và tên đầy đủ"
            />

            <InputField
              icon={<Mail size={18} />}
              label="Email"
              type="email"
              name="email"
              value={parentInfo.email || ""}
              onChange={onInfoChange}
              placeholder="example@email.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <InputField
                  icon={<Phone size={18} />}
                  label="Số điện thoại"
                  name="phone"
                  value={parentInfo.phone || ""}
                  onChange={onInfoChange}
                  placeholder="0912..."
                  disabled={isPhoneVerified}
                />
                {hasPhoneChanged && !isPhoneVerified && !isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={countdown > 0 || isVerifying}
                    className={`absolute right-2 top-9 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      countdown > 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi mã"}
                  </button>
                )}
                {isPhoneVerified && (
                  <div className="absolute right-2 top-10 text-green-500 flex items-center gap-1">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">Đã xác minh</span>
                  </div>
                )}
              </div>
              <InputField
                icon={<Calendar size={18} />}
                label="Ngày sinh"
                type="date"
                name="dateOfBirth"
                value={
                  parentInfo.dateOfBirth
                    ? parentInfo.dateOfBirth.split("T")[0]
                    : ""
                }
                onChange={onInfoChange}
              />
            </div>

            {isOtpSent && (
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-blue-800">
                    Nhập mã xác minh (OTP)
                  </label>
                  <button
                    onClick={() => setIsOtpSent(false)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-center tracking-[0.5em] font-bold"
                    placeholder="000000"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otp.length < 6}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
                  >
                    {isVerifying ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSaving || (hasPhoneChanged && !isPhoneVerified)}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
}

const InputField = ({ label, icon, className, ...props }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 placeholder:text-gray-400"
      />
    </div>
  </div>
);
