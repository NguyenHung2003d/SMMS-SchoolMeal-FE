"use client";

import { useRouter } from "next/navigation";

export default function ParentPage() {
  const router = useRouter();

  router.replace("/parent/register-meal");
  return null;
}
