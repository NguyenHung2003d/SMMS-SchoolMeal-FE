"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ParentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parent/register-meal");
  }, [router]);

  return null;
}
