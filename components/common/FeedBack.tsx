"use client";
import { Star, Quote, Users, Heart, Trophy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { TextPlugin } from "gsap/TextPlugin";
import { ParentFeedbackData } from "@/data/feedback";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const ParentFeedbackSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 50, opacity: 0 }, // Trạng thái bắt đầu
          {
            y: 0,
            opacity: 1, // Trạng thái kết thúc
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%", // Kích hoạt sớm hơn một chút
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const validCards = cardsRef.current.filter((card) => card !== null);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      statsRef.current.forEach((stat) => {
        if (!stat) return;
        const valueDisplay = stat.querySelector(".stat-value");
        if (!valueDisplay) return;

        const targetValue = valueDisplay.getAttribute("data-value") || "0";
        const numericValue = parseFloat(targetValue.replace(/[^0-9.]/g, ""));
        const suffix = targetValue.replace(/[0-9.]/g, "");

        gsap.fromTo(
          valueDisplay,
          { textContent: 0, opacity: 0 }, // Thêm opacity 0 lúc đầu
          {
            textContent: numericValue,
            opacity: 1,
            duration: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onUpdate: function () {
              const currentVal = Math.ceil(
                Number(this.targets()[0].textContent)
              );
              valueDisplay.textContent = `${currentVal}${suffix}`;
            },
          }
        );
      });
    }, containerRef); // Scope context vào containerRef

    return () => ctx.revert();
  }, []);

  const StarRating = ({ stars }: { stars: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={`${
            index < stars
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  if (!ParentFeedbackData || ParentFeedbackData.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 px-4 overflow-hidden bg-orange-50" // Bỏ /30 để check màu nền rõ hơn, hoặc giữ nguyên nếu muốn mờ
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-20 opacity-0">
          {" "}
          {/* Thêm class opacity-0 để tránh flash lúc load */}
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4 tracking-wide uppercase">
            Phản hồi thực tế
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Phụ huynh nói gì về <span className="text-orange-600">EduMeal</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Hơn 1,000 phụ huynh đã tin tưởng sử dụng để đồng hành cùng dinh
            dưỡng và sự phát triển của con trẻ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {ParentFeedbackData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="opacity-0 group relative bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-xl shadow-orange-900/5 hover:shadow-orange-900/10 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-6 right-6 text-orange-100 group-hover:text-orange-200 transition-colors duration-300">
                <Quote size={80} fill="currentColor" className="opacity-50" />
              </div>

              <div className="relative inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 mb-6">
                <span className="font-bold text-gray-900">
                  {testimonial.rating}
                </span>
                <span className="text-xs text-gray-400">/ 10</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
                <StarRating stars={testimonial.stars} />
              </div>

              <div className="relative z-10 mb-8">
                <p className="text-gray-700 text-lg leading-relaxed italic font-medium">
                  "{testimonial.text}"
                </p>
                {testimonial.feedback && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-sm text-orange-700">
                      <span className="font-semibold">❤️ Bé thích:</span>{" "}
                      {testimonial.feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={testimonial.author.avatar}
                    alt={testimonial.author.name}
                    className="object-cover w-full h-full bg-gray-100"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {testimonial.author.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.author.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-[2.5rem] p-12 relative overflow-hidden text-white shadow-2xl">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div
              ref={(el) => {
                statsRef.current[0] = el;
              }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-2">
                <Users size={32} />
              </div>
              <div
                className="stat-value text-5xl font-extrabold tracking-tight"
                data-value="1000+"
              >
                1000+{" "}
                {/* Đặt giá trị mặc định luôn để nếu JS lỗi vẫn hiện số */}
              </div>
              <p className="text-gray-400 font-medium text-lg">
                Phụ huynh tin dùng
              </p>
            </div>

            <div
              ref={(el) => {
                statsRef.current[1] = el;
              }}
              className="flex flex-col items-center justify-center text-center space-y-4 md:border-x border-gray-800"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-2">
                <Heart size={32} />
              </div>
              <div
                className="stat-value text-5xl font-extrabold tracking-tight"
                data-value="99%"
              >
                99%
              </div>
              <p className="text-gray-400 font-medium text-lg">
                Mức độ hài lòng
              </p>
            </div>

            {/* Stat 3 */}
            <div
              ref={(el) => {
                statsRef.current[2] = el;
              }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-2">
                <Trophy size={32} />
              </div>
              <div
                className="stat-value text-5xl font-extrabold tracking-tight"
                data-value="4.9★"
              >
                4.9★
              </div>
              <p className="text-gray-400 font-medium text-lg">
                Đánh giá trung bình
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentFeedbackSection;
