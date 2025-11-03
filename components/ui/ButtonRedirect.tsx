'use client';

import { Button } from "@/components/ui/button";

export default function ButtonRedirect() {
  return (
    <Button 
      variant="outline" 
      size="lg" 
      onClick={() => window.history.back()}
      className="text-lg px-10 py-7 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-gray-300 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full font-semibold"
    >
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Quay lại
    </Button>
  );
}