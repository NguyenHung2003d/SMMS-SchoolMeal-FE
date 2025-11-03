"use client";
import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/app/loading";
import { useLoading } from "@/context/LoadingContext";

export default function RouteLoaderOverlay() {
  const pathname = usePathname();
  const {loading, setLoading} = useLoading();
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/75 backdrop-blur-sm">
      <Loader />
    </div>
  );
}
