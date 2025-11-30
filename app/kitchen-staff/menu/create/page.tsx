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
  // Mock data for menu library
  const menuLibrary = [
    {
      id: 1,
      name: 'Thực đơn tuần 42/2023',
      description: 'Thực đơn cân bằng dinh dưỡng với các món ăn phổ biến',
      dishes: 10,
      rating: 4.8,
      lastUsed: '10/10/2023',
    },
    {
      id: 2,
      name: 'Thực đơn mùa hè',
      description: 'Thực đơn nhẹ nhàng, tươi mát cho mùa hè',
      dishes: 12,
      rating: 4.5,
      lastUsed: '15/07/2023',
    },
    {
      id: 3,
      name: 'Thực đơn đặc biệt',
      description: 'Thực đơn cho các dịp lễ đặc biệt',
      dishes: 8,
      rating: 4.7,
      lastUsed: '02/09/2023',
    },
  ]
  // Mock data for food library
  const foodLibrary = [
    {
      id: 1,
      name: 'Cơm gà rau củ',
      category: 'Bữa trưa',
      ingredients: ['Gạo lứt', 'Thịt gà', 'Cà rốt', 'Bông cải xanh'],
      allergies: [],
      nutritionalInfo: {
        calories: 450,
        protein: 25,
        carbs: 60,
        fat: 8,
      },
      image: 'https://i.imgur.com/wgJDypg.jpg',
    },
    {
      id: 2,
      name: 'Bún chả cá',
      category: 'Bữa trưa',
      ingredients: ['Bún', 'Chả cá', 'Rau sống', 'Nước mắm pha'],
      allergies: ['Cá'],
      nutritionalInfo: {
        calories: 420,
        protein: 22,
        carbs: 55,
        fat: 10,
      },
      image: 'https://i.imgur.com/QNXAyTp.jpg',
    },
    {
      id: 3,
      name: 'Cơm sườn kho',
      category: 'Bữa trưa',
      ingredients: ['Cơm trắng', 'Sườn kho', 'Canh rau ngót'],
      allergies: [],
      nutritionalInfo: {
        calories: 520,
        protein: 28,
        carbs: 65,
        fat: 15,
      },
      image: 'https://i.imgur.com/t9oKhEo.jpg',
    },
    {
      id: 4,
      name: 'Bún riêu cua',
      category: 'Bữa trưa',
      ingredients: ['Bún', 'Riêu cua', 'Đậu hũ', 'Rau sống', 'Giá đỗ'],
      allergies: ['Hải sản'],
      nutritionalInfo: {
        calories: 450,
        protein: 20,
        carbs: 60,
        fat: 12,
      },
      image: 'https://i.imgur.com/Fd7LCKk.jpg',
    },
    {
      id: 5,
      name: 'Sữa chua & hoa quả',
      category: 'Tráng miệng',
      ingredients: ['Sữa chua không đường', 'Hoa quả tươi theo mùa'],
      allergies: ['Sữa'],
      nutritionalInfo: {
        calories: 150,
        protein: 5,
        carbs: 25,
        fat: 3,
      },
      image: 'https://i.imgur.com/K8gDgTf.jpg',
    },
    {
      id: 6,
      name: 'Bánh flan caramel',
      category: 'Tráng miệng',
      ingredients: ['Trứng', 'Sữa', 'Đường', 'Caramel'],
      allergies: ['Trứng', 'Sữa'],
      nutritionalInfo: {
        calories: 180,
        protein: 5,
        carbs: 30,
        fat: 5,
      },
      image: 'https://i.imgur.com/wHXtNAl.jpg',
    },
  ]
  // Mock data for AI suggestions
  const aiSuggestions = [
    {
      id: 1,
      title: 'Thực đơn cân bằng dinh dưỡng',
      description:
        'Thực đơn cân bằng với đầy đủ dinh dưỡng, phù hợp với học sinh tiểu học',
      dishes: [
        {
          name: 'Cơm gà rau củ',
          day: 'Thứ Hai',
        },
        {
          name: 'Bún chả cá',
          day: 'Thứ Ba',
        },
        {
          name: 'Cơm sườn kho',
          day: 'Thứ Tư',
        },
        {
          name: 'Bún riêu cua',
          day: 'Thứ Năm',
        },
        {
          name: 'Cơm thịt kho trứng',
          day: 'Thứ Sáu',
        },
      ],
      desserts: [
        {
          name: 'Sữa chua & hoa quả',
          day: 'Thứ Hai',
        },
        {
          name: 'Bánh flan caramel',
          day: 'Thứ Ba',
        },
        {
          name: 'Chè đậu xanh',
          day: 'Thứ Tư',
        },
        {
          name: 'Trái cây theo mùa',
          day: 'Thứ Năm',
        },
        {
          name: 'Sữa đậu nành',
          day: 'Thứ Sáu',
        },
      ],
    },
    {
      id: 2,
      title: 'Thực đơn truyền thống Việt Nam',
      description:
        'Thực đơn với các món ăn truyền thống Việt Nam, giàu dinh dưỡng',
      dishes: [
        {
          name: 'Phở gà',
          day: 'Thứ Hai',
        },
        {
          name: 'Cơm tấm sườn',
          day: 'Thứ Ba',
        },
        {
          name: 'Bún bò Huế',
          day: 'Thứ Tư',
        },
        {
          name: 'Cơm gà Hải Nam',
          day: 'Thứ Năm',
        },
        {
          name: 'Bánh cuốn',
          day: 'Thứ Sáu',
        },
      ],
      desserts: [
        {
          name: 'Chè trôi nước',
          day: 'Thứ Hai',
        },
        {
          name: 'Bánh chuối hấp',
          day: 'Thứ Ba',
        },
        {
          name: 'Chè bắp',
          day: 'Thứ Tư',
        },
        {
          name: 'Sữa chua nếp cẩm',
          day: 'Thứ Năm',
        },
        {
          name: 'Hoa quả dầm',
          day: 'Thứ Sáu',
        },
      ],
    },
    {
      id: 3,
      title: 'Thực đơn ít dầu mỡ',
      description:
        'Thực đơn giảm dầu mỡ, tập trung vào các món hấp, luộc và nướng',
      dishes: [
        {
          name: 'Cơm gà hấp lá sen',
          day: 'Thứ Hai',
        },
        {
          name: 'Bún thịt nướng',
          day: 'Thứ Ba',
        },
        {
          name: 'Cơm cá hồi sốt chanh dây',
          day: 'Thứ Tư',
        },
        {
          name: 'Miến xào rau củ',
          day: 'Thứ Năm',
        },
        {
          name: 'Cơm trộn Hàn Quốc',
          day: 'Thứ Sáu',
        },
      ],
      desserts: [
        {
          name: 'Salad hoa quả',
          day: 'Thứ Hai',
        },
        {
          name: 'Sữa chua mật ong',
          day: 'Thứ Ba',
        },
        {
          name: 'Sinh tố bơ',
          day: 'Thứ Tư',
        },
        {
          name: 'Dưa hấu',
          day: 'Thứ Năm',
        },
        {
          name: 'Pudding táo',
          day: 'Thứ Sáu',
        },
      ],
    },
  ]
  // Mock data for new menu
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    weekStart: '',
    weekEnd: '',
    monday: {
      main: null,
      dessert: null,
    },
    tuesday: {
      main: null,
      dessert: null,
    },
    wednesday: {
      main: null,
      dessert: null,
    },
    thursday: {
      main: null,
      dessert: null,
    },
    friday: {
      main: null,
      dessert: null,
    },
  })
  const handleSelectMenuFromLibrary = (menuId: number) => {
    setSelectedMenuFromLibrary(menuId)
    // In a real app, you would load the menu details and populate the form
    setActiveView('create')
    // Mock data update
    setNewMenu({
      name: 'Thực đơn tuần 42/2023 (sao chép)',
      description: 'Thực đơn cân bằng dinh dưỡng với các món ăn phổ biến',
      weekStart: '16/10/2023',
      weekEnd: '20/10/2023',
      monday: {
        main: foodLibrary[0],
        dessert: foodLibrary[4],
      },
      tuesday: {
        main: foodLibrary[1],
        dessert: foodLibrary[5],
      },
      wednesday: {
        main: foodLibrary[2],
        dessert: null,
      },
      thursday: {
        main: foodLibrary[3],
        dessert: null,
      },
      friday: {
        main: null,
        dessert: null,
      },
    })
  }
  const handleSelectAiSuggestion = (suggestionId: number) => {
    // In a real app, you would load the AI suggestion details and populate the form
    setActiveView('create')
    // Mock data update
    setNewMenu({
      name: 'Thực đơn AI đề xuất',
      description: 'Thực đơn cân bằng dinh dưỡng theo đề xuất AI',
      weekStart: '16/10/2023',
      weekEnd: '20/10/2023',
      monday: {
        main: foodLibrary[0],
        dessert: foodLibrary[4],
      },
      tuesday: {
        main: foodLibrary[1],
        dessert: foodLibrary[5],
      },
      wednesday: {
        main: foodLibrary[2],
        dessert: null,
      },
      thursday: {
        main: foodLibrary[3],
        dessert: null,
      },
      friday: {
        main: null,
        dessert: null,
      },
    })
  }
  const handleSelectDishFromLibrary = (dishId: number) => {
    const isSelected = selectedDishes.includes(dishId)
    if (isSelected) {
      setSelectedDishes(selectedDishes.filter((id) => id !== dishId))
    } else {
      setSelectedDishes([...selectedDishes, dishId])
    }
  }
  const handleAddSelectedDishesToMenu = () => {
    // In a real app, you would add the selected dishes to the menu
    setIsAddDishModalOpen(false)
    // For demo purposes, let's add the first selected dish to Monday's main
    if (selectedDishes.length > 0) {
      const dish = foodLibrary.find((dish) => dish.id === selectedDishes[0])
      if (dish) {
        setNewMenu({
          ...newMenu,
          monday: {
            ...newMenu.monday,
            main: dish,
          },
        })
      }
    }
  }
  const renderCreateMenuForm = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Thông tin thực đơn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thực đơn
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập tên thực đơn"
              value={newMenu.name}
              onChange={(e) =>
                setNewMenu({
                  ...newMenu,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newMenu.weekStart}
                onChange={(e) =>
                  setNewMenu({
                    ...newMenu,
                    weekStart: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newMenu.weekEnd}
                onChange={(e) =>
                  setNewMenu({
                    ...newMenu,
                    weekEnd: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={2}
            placeholder="Nhập mô tả thực đơn"
            value={newMenu.description}
            onChange={(e) =>
              setNewMenu({
                ...newMenu,
                description: e.target.value,
              })
            }
          ></textarea>
        </div>
      </div>
      {/* Daily menu items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Thực đơn hàng ngày</h2>
        {/* Monday */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Thứ Hai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main dish */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Món chính</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              {newMenu.monday.main ? (
                <div className="relative">
                  <div className="rounded-lg overflow-hidden h-32 mb-2">
                    <img
                      src={newMenu.monday.main.image}
                      alt={newMenu.monday.main.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">{newMenu.monday.main.name}</h5>
                  <p className="text-sm text-gray-600">
                    {newMenu.monday.main.ingredients.join(', ')}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Thêm món chính</p>
                  </div>
                </div>
              )}
            </div>
            {/* Dessert */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Tráng miệng</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              {newMenu.monday.dessert ? (
                <div className="relative">
                  <div className="rounded-lg overflow-hidden h-32 mb-2">
                    <img
                      src={newMenu.monday.dessert.image}
                      alt={newMenu.monday.dessert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">{newMenu.monday.dessert.name}</h5>
                  <p className="text-sm text-gray-600">
                    {newMenu.monday.dessert.ingredients.join(', ')}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Thêm tráng miệng</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tuesday */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Thứ Ba</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main dish */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Món chính</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              {newMenu.tuesday.main ? (
                <div className="relative">
                  <div className="rounded-lg overflow-hidden h-32 mb-2">
                    <img
                      src={newMenu.tuesday.main.image}
                      alt={newMenu.tuesday.main.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">{newMenu.tuesday.main.name}</h5>
                  <p className="text-sm text-gray-600">
                    {newMenu.tuesday.main.ingredients.join(', ')}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Thêm món chính</p>
                  </div>
                </div>
              )}
            </div>
            {/* Dessert */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Tráng miệng</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              {newMenu.tuesday.dessert ? (
                <div className="relative">
                  <div className="rounded-lg overflow-hidden h-32 mb-2">
                    <img
                      src={newMenu.tuesday.dessert.image}
                      alt={newMenu.tuesday.dessert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">
                    {newMenu.tuesday.dessert.name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {newMenu.tuesday.dessert.ingredients.join(', ')}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Thêm tráng miệng</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Wednesday */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Thứ Tư</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main dish */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Món chính</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              {newMenu.wednesday.main ? (
                <div className="relative">
                  <div className="rounded-lg overflow-hidden h-32 mb-2">
                    <img
                      src={newMenu.wednesday.main.image}
                      alt={newMenu.wednesday.main.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">{newMenu.wednesday.main.name}</h5>
                  <p className="text-sm text-gray-600">
                    {newMenu.wednesday.main.ingredients.join(', ')}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 bg-white/80 rounded-full hover:bg-white text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Thêm món chính</p>
                  </div>
                </div>
              )}
            </div>
            {/* Dessert */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Tráng miệng</h4>
                <button
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  onClick={() => setIsAddDishModalOpen(true)}
                >
                  + Thêm món
                </button>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50"
                onClick={() => setIsAddDishModalOpen(true)}
              >
                <div className="text-center">
                  <Plus size={24} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-sm text-gray-500">Thêm tráng miệng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Thursday and Friday would be similar to above, omitted for brevity */}
        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center">
            <Save size={18} className="mr-2" />
            Xuất bản thực đơn
          </button>
        </div>
      </div>
    </div>
  )
  const renderMenuLibrary = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Thư viện thực đơn</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm thực đơn..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuLibrary.map((menu) => (
          <div
            key={menu.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleSelectMenuFromLibrary(menu.id)}
          >
            <h3 className="font-medium text-gray-800 mb-1">{menu.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{menu.description}</p>
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-500">Món ăn: </span>
                <span className="font-medium">{menu.dishes}</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{menu.rating}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Sử dụng lần cuối: {menu.lastUsed}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => setActiveView('create')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Quay lại
        </button>
      </div>
    </div>
  )
  const renderAiSuggest = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Đề xuất thực đơn từ AI</h2>
          <p className="text-sm text-gray-600 mt-1">
            Dựa trên các nguyên liệu hiện có và sở thích của học sinh
          </p>
        </div>
      </div>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <Sparkles size={18} className="mr-2" />
          Gợi ý nguyên liệu
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Hãy cho AI biết những nguyên liệu chính và phụ bạn muốn sử dụng trong
          thực đơn tuần này
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Nguyên liệu chính
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Ví dụ: thịt gà, thịt heo, cá, đậu hũ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Nguyên liệu phụ
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Ví dụ: rau củ, nấm, đậu..."
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Yêu cầu đặc biệt
          </label>
          <textarea
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            rows={2}
            placeholder="Ví dụ: ít dầu mỡ, phù hợp cho trẻ em, đảm bảo dinh dưỡng..."
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Sparkles size={18} className="mr-2" />
            Tạo đề xuất
          </button>
        </div>
      </div>
      <h3 className="font-medium text-gray-800 mb-4">Đề xuất từ AI</h3>
      <div className="space-y-6">
        {aiSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all"
          >
            <h3 className="font-medium text-gray-800 mb-1">
              {suggestion.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {suggestion.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Món chính:
                </h4>
                <ul className="text-sm space-y-1">
                  {suggestion.dishes.map((dish, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-600">{dish.day}:</span>
                      <span className="font-medium">{dish.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tráng miệng:
                </h4>
                <ul className="text-sm space-y-1">
                  {suggestion.desserts.map((dessert, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-600">{dessert.day}:</span>
                      <span className="font-medium">{dessert.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                onClick={() => handleSelectAiSuggestion(suggestion.id)}
              >
                Chọn thực đơn này
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => setActiveView('create')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Quay lại
        </button>
      </div>
    </div>
  )
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
        {activeView === 'create' && renderCreateMenuForm()}
        {activeView === 'library' && renderMenuLibrary()}
        {activeView === 'aiSuggest' && renderAiSuggest()}
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
                  {foodLibrary.map((dish) => (
                    <div
                      key={dish.id}
                      className={`border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${selectedDishes.includes(dish.id) ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'}`}
                      onClick={() => handleSelectDishFromLibrary(dish.id)}
                    >
                      <div className="relative h-40">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {selectedDishes.includes(dish.id) ? (
                            <div className="bg-orange-500 text-white p-1 rounded-full">
                              <Check size={16} />
                            </div>
                          ) : (
                            <div className="bg-white/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                              {dish.category}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-800">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {dish.ingredients.join(', ')}
                        </p>
                        {dish.allergies.length > 0 && (
                          <div className="flex items-center mt-2">
                            <AlertTriangle
                              size={14}
                              className="text-orange-500 mr-1"
                            />
                            <span className="text-xs text-orange-600">
                              Dị ứng: {dish.allergies.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                    onClick={handleAddSelectedDishesToMenu}
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
