import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#6D5A89] via-[#9B8147] to-[#C0A85A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🥗</div>
        <div className="absolute top-20 right-20 text-4xl">🍎</div>
        <div className="absolute bottom-20 left-1/4 text-5xl">🥕</div>
        <div className="absolute bottom-10 right-1/3 text-3xl">🥛</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-4xl animate-bounce">🍎</div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  EduMeal
                </h3>
                <p className="text-sm text-green-200">
                  Healthy School Nutrition
                </p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed mb-6">
              Nourishing young minds with delicious, healthy meals since 1992.
              Every meal is crafted with love and nutrition in mind.
            </p>
          </div>

          <div>
            <h6 className="font-bold mb-4 text-yellow-300 flex items-center">
              <span className="mr-2">🍽️</span>
              Our Menu
            </h6>
            <ul className="space-y-3 text-green-100">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🥪
                  </span>
                  Healthy Breakfast
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🍲
                  </span>
                  Nutritious Lunch
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🥤
                  </span>
                  Fresh Beverages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🍪
                  </span>
                  Healthy Snacks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-4 text-blue-300 flex items-center">
              <span className="mr-2">🏫</span>
              School Services
            </h6>
            <ul className="space-y-3 text-green-100">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    📋
                  </span>
                  Meal Planning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    👨‍🍳
                  </span>
                  Catering Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    📊
                  </span>
                  Nutrition Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🎓
                  </span>
                  School Programs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-4 text-purple-300 flex items-center">
              <span className="mr-2">📞</span>
              Support
            </h6>
            <ul className="space-y-3 text-green-100">
              <li>
                <a
                  href="#"
                  className="hover:text-purple-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    📧
                  </span>
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    ❓
                  </span>
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    🔒
                  </span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-300 transition-all duration-300 flex items-center group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">
                    📜
                  </span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-600/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-green-200 text-sm mb-4 md:mb-0 flex items-center">
              <span className="mr-2">🌱</span>© 2024 EduMeal. Nourishing
              students with love and care.
            </div>
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-green-200">Follow us:</span>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <span className="text-white text-xs">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
                >
                  <span className="text-white text-xs">📷</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                >
                  <span className="text-white text-xs">🐦</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
