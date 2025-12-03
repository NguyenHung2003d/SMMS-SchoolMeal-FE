'use client'
import React, { useState } from 'react'
import {
  Utensils,
  Calendar,
  Plus,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  Check,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react'

export default function KitchenStaffMenuCreationPage() {
  const [activeView, setActiveView] = useState('create') // create, library, aiSuggest
  const [selectedMenuFromLibrary, setSelectedMenuFromLibrary] = useState<
    number | null
  >(null)
  const [selectedDishes, setSelectedDishes] = useState<number[]>([])
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false)
  const [isAiSuggestModalOpen, setIsAiSuggestModalOpen] = useState(false)
  const [isViewDishModalOpen, setIsViewDishModalOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState<any>(null)
  const [selectedWeek, setSelectedWeek] = useState('current')

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeView === 'create'
                ? 'Tạo thực đơn mới'
                : activeView === 'library'
                  ? 'Thư viện thực đơn'
                  : 'Đề xuất thực đơn từ AI'}
            </h1>
            {activeView === 'create' && (
              <div className="flex items-center mt-1">
                <div className="relative">
                  <select
                    className="appearance-none bg-orange-100 text-orange-800 rounded-lg pl-3 pr-8 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                  >
                    <option value="previous">Tuần trước (09/10 - 13/10)</option>
                    <option value="current">Tuần này (16/10 - 20/10)</option>
                    <option value="next">Tuần sau (23/10 - 27/10)</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-2.5 text-orange-800 pointer-events-none"
                  />
                </div>
              </div>
            )}
          </div>
          {activeView === 'create' && (
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => setActiveView('library')}
              >
                <FileText size={18} className="mr-2" />
                <span>Chọn từ thư viện</span>
              </button>
              <button
                className="px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 flex items-center"
                onClick={() => setActiveView('aiSuggest')}
              >
                <Sparkles size={18} className="mr-2" />
                <span>AI đề xuất</span>
              </button>
            </div>
          )}
        </div>
        {/* Add dish modal */}
        {isAddDishModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Thư viện món ăn
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Chọn món ăn để thêm vào thực đơn
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={() => setIsAddDishModalOpen(false)}
                  >
                    <X size={18} className="mr-2" />
                    Đóng
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
                    onClick={() => setIsAddDishModalOpen(false)}
                  >
                    <Plus size={18} className="mr-2" />
                    Tạo món mới
                  </button>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Tìm kiếm món ăn..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="all">Tất cả danh mục</option>
                    <option value="main">Món chính</option>
                    <option value="dessert">Tráng miệng</option>
                  </select>
                  <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">
                    Đã chọn:{' '}
                    <span className="font-medium">{selectedDishes.length}</span>{' '}
                    món
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAddDishModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Thêm vào thực đơn
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
  
}
