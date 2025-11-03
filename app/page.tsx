"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Slider from "@/components/common/ProblemSolution";
import HeroSection from "@/components/common/HeroSection";
import Features from "@/components/common/Features";
import ParentFeedbackSection from "@/components/common/FeedBack";
import Contact from "@/components/common/Contact";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const slideRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, x: -100, rotateY: -15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: slideRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    if (featureRef.current) {
      gsap.fromTo(
        featureRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featureRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    if (feedbackRef.current) {
      gsap.fromTo(
        feedbackRef.current,
        { opacity: 0, x: 100, rotation: 5 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: feedbackRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="overflow-hidden">
      <Navbar />
      <HeroSection />

      <div ref={slideRef}>
        <Slider />
      </div>

      <div ref={featureRef}>
        <Features />
      </div>

      <div ref={feedbackRef}>
        <ParentFeedbackSection />
      </div>

      <div ref={contactRef}>
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
