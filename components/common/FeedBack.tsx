"use client";
import { ParentFeedbackData } from "@/data";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const ParentFeedbackSection = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      statsRef.current.forEach((start) => {
        if (!start) return;
        const value = start.querySelector(".start-value");
        if (!value) return;

        const target = value.getAttribute("data-value") || "0";
        const pureNumber = parseInt(target.replace(/\D/g, ""), 10);

        gsap.fromTo(
          value,
          {
            textContent: 0,
          },
          {
            textContent: pureNumber,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: start,
              start: "top 85%",
            },
            onUpdate: function () {
              const current = Math.ceil(Number((value as any).textContent));
              if (target.includes("%")) {
                value.textContent = current + "%";
              } else if (target.includes("+")) {
                value.textContent = current + "+";
              } else if (target.includes("★")) {
                value.textContent = current + "★";
              } else {
                value.textContent = String(current);
              }
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const StarRating = ({ stars }: { stars: number }) => (
    <div className="flex gap-1 mb-5">
      {[
        ...Array(5).map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < stars ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <Star fill={index < stars ? "currentColor" : "none"} />
          </span>
        )),
      ]}
    </div>
  );
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div ref={headerRef}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Phụ huynh nói gì về EduMeal
          </h2>
        </div>

        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
          Chia sẻ từ phụ huynh về trải nghiệm sử dụng EduMeal để theo dõi bữa ăn
          và hoạt động của con
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ParentFeedbackData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative group"
            >
              <div className="absolute -top-4 right-6 bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                {testimonial.rating}
              </div>

              <StarRating stars={testimonial.stars} />

              <div className="text-left mb-6 relative">
                <span className="text-3xl text-orange-500 font-bold absolute -top-2 -left-2">
                  "
                </span>
                <p className="text-gray-700 italic leading-relaxed pl-6">
                  {testimonial.text}
                </p>
                <h4 className="font-semibold">{testimonial.author.name}</h4>
                <p className="text-sm text-gray-500">
                  {testimonial.author.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="text-center"
            ref={(el) => {
              statsRef.current[0] = el;
            }}
          >
            <div
              className="text-3xl font-bold text-orange-500 mb-2 start-value"
              data-value="1000+"
            >
              0
            </div>
            <div className="text-gray-600">Phụ huynh tin tưởng</div>
          </div>
          <div
            className="text-center"
            ref={(el) => {
              statsRef.current[1] = el;
            }}
          >
            <div
              className="text-3xl font-bold text-orange-500 mb-2 start-value"
              data-value="99"
            >
              0
            </div>
            <div className="text-gray-600">Mức độ hài lòng</div>
          </div>
          <div
            className="text-center"
            ref={(el) => {
              statsRef.current[2] = el;
            }}
          >
            <div
              className="text-3xl font-bold text-orange-500 mb-2 start-value"
              data-value="5"
            >
              0
            </div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentFeedbackSection;
