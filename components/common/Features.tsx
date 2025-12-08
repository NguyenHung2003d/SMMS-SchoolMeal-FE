"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Utensils,
  Activity,
  X,
  CheckCircle2,
  Sparkles,
  LucideIcon,
  Receipt,
  MessageSquareText,
} from "lucide-react";
import { Feature } from "@/types";
import { features } from "@/data";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  activity: Activity,
  receipt: Receipt,
  message: MessageSquareText,
};

interface FeatureModalProps {
  feature: Feature;
  onClose: () => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ feature, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.2)",
          delay: 0.1,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  if (!feature) return null;

  const Icon = iconMap[feature.icon] || Utensils;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      <div
        ref={contentRef}
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <div
          className={`w-full md:w-1/3 bg-gradient-to-br ${feature.color} p-8 text-white flex flex-col justify-between relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

          <div>
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
              <Icon size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{feature.details.title}</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {feature.details.description}
            </p>
          </div>

          <div className="mt-8 hidden md:block">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} />{" "}
                <span className="text-sm font-semibold">Điểm nổi bật</span>
              </div>
              <ul className="text-sm space-y-2">
                {feature.details.mockupFeatures.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 opacity-90">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-8 overflow-y-auto bg-gray-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors z-10"
          >
            <X size={20} className="text-gray-600" />
          </button>

          <div className="space-y-8">
            <div>
              <h4
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${feature.accentColor}`}
              >
                <CheckCircle2 size={20} /> Lợi ích cốt lõi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feature.details.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`mt-1 min-w-[8px] h-2 rounded-full bg-gradient-to-r ${feature.color}`}
                    />
                    <span className="text-gray-700 font-medium text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${feature.accentColor}`}
              >
                <Activity size={20} /> Tính năng hệ thống
              </h4>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {feature.details.mockupFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r ${feature.color}`}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        });
      }

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 100, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="py-24 relative overflow-hidden bg-white"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div ref={headerRef} className="text-center mb-20">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-4 uppercase tracking-wider">
              Hệ Sinh Thái
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Công nghệ cho{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Bữa Trưa Học Đường
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-lg">
              Giải pháp toàn diện kết nối Nhà trường, Phụ huynh và Học sinh nhằm
              nâng cao chất lượng dinh dưỡng và trải nghiệm ăn uống.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Utensils;

              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className={`group relative ${feature.bgClass} rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-black/5 cursor-pointer flex flex-col h-full`}
                  onClick={() => setActiveFeature(feature as Feature)}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`w-7 h-7 ${feature.accentColor}`}
                      strokeWidth={2}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {feature.subtitle}
                  </p>

                  <div className="relative w-full h-40 bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-white/50 mb-6 group-hover:shadow-md transition-all z-10">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${feature.color
                        .replace("from-", "from-black/0 to-")
                        .replace(
                          "to-",
                          ""
                        )} opacity-10 group-hover:opacity-20 transition-opacity`}
                    ></div>
                  </div>

                  <button className="w-full bg-white hover:bg-white/80 text-gray-800 font-semibold py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group-hover:shadow-md transition-all">
                    <span className="text-sm">Chi tiết</span>
                    <div
                      className={`w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors`}
                    >
                      <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {activeFeature && (
        <FeatureModal
          feature={activeFeature}
          onClose={() => setActiveFeature(null)}
        />
      )}
    </>
  );
};

export default Features;
