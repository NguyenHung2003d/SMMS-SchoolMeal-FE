import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Suspense } from "react";
import Loader from "@/app/loading";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #D3CAE2, #E6C17A)" }}
    >
      <Navbar />
      <Suspense fallback={<Loader />}>
        <main className="flex-1">{children}</main>
      </Suspense>
      <Footer />
    </div>
  );
}
