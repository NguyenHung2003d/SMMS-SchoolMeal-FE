import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  MessageSquare,
  AlertCircle,
  Utensils,
  Loader2,
  Send,
  Soup,
  ChefHat,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, getDayName } from "@/helpers";
import { MealDetailModalProps, MenuFoodItemDto } from "@/types/parent";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export default function MealDetailModal({
  selectedMeal,
  onClose,
}: MealDetailModalProps) {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!selectedMeal || !feedbackContent.trim()) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/ParentFeedback/create", {
        dailyMealId: selectedMeal.dailyMealId,
        content: feedbackContent,
      });
      toast.success("Gửi đánh giá thành công!");
      setFeedbackContent("");
      onClose();
    } catch (error) {
      toast.error("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealDate =
    selectedMeal.mealDate || selectedMeal.MealDate || selectedMeal.date || "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              {getDayName(mealDate)}
            </h3>
            <p className="text-orange-100 text-sm opacity-90">
              Thực đơn ngày {formatDate(mealDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>

        <Tabs
          defaultValue="info"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4 pb-2 bg-white border-b border-gray-100">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger
                value="info"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium transition-all"
              >
                <Soup size={16} className="mr-2" /> Chi tiết món ăn
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium transition-all"
              >
                <MessageSquare size={16} className="mr-2" /> Gửi góp ý
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="info"
            className="flex-1 overflow-hidden flex flex-col p-0 m-0 bg-gray-50/50"
          >
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {selectedMeal.foods && selectedMeal.foods.length > 0 ? (
                  selectedMeal.foods.map((food: MenuFoodItemDto) => (
                    <div
                      key={food.foodId || food.FoodId}
                      className="group flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                        <Image
                          src={
                            food.imageUrl || food.ImageUrl || "/placeholder.png"
                          }
                          alt={food.foodName || food.FoodName || "Food"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-gray-800 text-base line-clamp-2">
                          {food.foodName || food.FoodName}
                        </p>

                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                          {food.foodDesc ||
                            food.FoodDesc ||
                            "Món ăn giàu dinh dưỡng, được chế biến an toàn."}
                        </p>

                        {(food.isAllergenic || food.IsAllergenic) && (
                          <div className="mt-3 flex items-start gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 w-fit">
                            <AlertCircle
                              size={14}
                              className="text-red-500 mt-0.5 shrink-0"
                            />
                            <span className="text-xs text-red-700 font-medium">
                              Cảnh báo dị ứng:{" "}
                              <span className="font-bold">
                                {food.allergenicNames?.join(", ") ||
                                  food.AllergenicNames?.join(", ")}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <Utensils size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Không có thông tin món ăn
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="feedback"
            className="flex-1 overflow-hidden flex flex-col p-0 m-0 bg-white"
          >
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 mb-6 shadow-sm">
                  <h4 className="text-orange-800 font-bold text-base mb-2 flex items-center gap-2">
                    <ChefHat size={20} /> Ý kiến của Phụ huynh
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nhà trường luôn lắng nghe mọi đóng góp của quý phụ huynh để
                    cải thiện chất lượng bữa ăn, giúp các bé ăn ngon miệng và
                    phát triển khỏe mạnh.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">
                    Nội dung góp ý của bạn:
                  </label>
                  <Textarea
                    placeholder="Ví dụ: Món canh hôm nay bé khen ngon, nhưng món xào hơi nhiều dầu..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    className="min-h-[150px] resize-none focus-visible:ring-orange-500 focus-visible:border-orange-500 p-4 text-base bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-100 bg-white">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all rounded-xl"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedbackContent.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                Gửi phản hồi
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
