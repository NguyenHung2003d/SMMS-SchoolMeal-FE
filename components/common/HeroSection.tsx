"use client";
import React, { useEffect, useRef } from "react";
import { images } from "@/data";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link";

gsap.registerPlugin(SplitText);

export default function HeroSection() {
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const { loading } = useLoading();

  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline();

    const headingSplit = new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });

    const descSplit = new SplitText(descRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });

    new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });

    new SplitText(descRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });

    gsap.set(".lineParent", { overflow: "hidden" });
    gsap.set(headingSplit.lines, { y: "-100%" });
    gsap.set(descSplit.lines, { y: "100%" });

    tl.to(headingSplit.lines, {
      y: "0%",
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
    }).to(
      descSplit.lines,
      {
        y: "0%",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      },
      "-=0.5"
    );

    return () => {
      headingSplit.revert();
      descSplit.revert();
      tl.kill();
    };
  }, [loading]);

  return (
    <section className="relative w-full h-screen overflow-hidden rounded-2xl shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[0].image})`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1
          ref={headingRef}
          className="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight"
        >
          Bữa Trưa
          <span className="block text-yellow-400">Ngon Lành</span>
        </h1>
        <p
          ref={descRef}
          className="text-xl lg:text-2xl mb-8 leading-relaxed drop-shadow-lg opacity-90 max-w-3xl"
        >
          Nền tảng quản lý bữa ăn trưa thông minh dành cho các bạn học sinh!
          Đặt cơm ngon, theo dõi dinh dưỡng và tận hưởng những bữa ăn bổ dưỡng
          mỗi ngày một cách dễ dàng và tiện lợi.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-xl transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95 text-lg"
        >
          Khám phá ngay
        </Link>
      </div>
    </section>
  );
}
