import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/10 p-8">
          <LoginForm mode="login" />
        </div>
      </div>
    </div>
  );
}
