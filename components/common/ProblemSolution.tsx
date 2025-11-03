"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { problems, solutions } from "@/data";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const problemRefs = useRef<HTMLDivElement[]>([]);
  const solutionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      problemRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            {
              y: 50,
              opacity: 0,
              x: -30,
            },
            {
              y: 0,
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      solutionRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            {
              y: 50,
              opacity: 0,
              x: 30,
            },
            {
              y: 0,
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2 + 0.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Từ <span className="text-red-500">Căng Thẳng</span> đến{" "}
            <span className="text-green-500">Dễ Dàng</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                😰 Những Khó Khăn Hàng Ngày
              </h3>
              <p className="text-gray-600">Phụ huynh bận rộn, con cái kén ăn</p>
            </div>

            {problems.map((problem, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) problemRefs.current[index] = el;
                }}
                className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-400 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl bg-red-100 p-3 rounded-full flex-shrink-0">
                    {problem.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {problem.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                ✨ Giải Pháp Thông Minh
              </h3>
              <p className="text-gray-600">Công nghệ đơn giản hóa mọi thứ</p>
            </div>

            {solutions.map((solution, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) solutionRefs.current[index] = el;
                }}
                className="bg-white p-6 rounded-2xl shadow-lg border-r-4 border-green-400 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl bg-green-100 p-3 rounded-full flex-shrink-0">
                    {solution.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
