import "./globals.css";
import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import { Providers } from "./providers";
import { Suspense } from "react";
import Loader from "./loading";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "SchoolMeal",
  description: "SchoolMeal - Dinh dưỡng cho bé yêu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${merriweather.variable}`} suppressHydrationWarning>
        <Suspense fallback={<Loader />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
