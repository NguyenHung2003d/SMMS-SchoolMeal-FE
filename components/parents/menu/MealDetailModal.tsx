import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Info,
  MessageSquare,
  AlertCircle,
  Utensils,
  Loader2,
  Send,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {  formatDate, getDayName } from "@/helpers";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full h-[80vh] flex flex-col overflow-hidden">
        <div className="bg-white p-4 border-b flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {getDayName(mealDate)}
            <span className="text-gray-400 font-normal text-sm">
              | {formatDate(mealDate)}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <Tabs
          defaultValue="info"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-4 pt-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info size={16} /> Chi tiết món
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare size={16} /> Gửi góp ý
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="info"
            className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=active]:flex"
          >
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {selectedMeal.foods && selectedMeal.foods.length > 0 ? (
                  selectedMeal.foods.map((food: MenuFoodItemDto) => (
                    <div
                      key={food.foodId || food.FoodId}
                      className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                        <Image
                          src={
                            food.imageUrl || food.ImageUrl || "/placeholder.png"
                          }
                          alt={food.foodName || food.FoodName || "Food"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-gray-800 text-sm line-clamp-2">
                          {food.foodName || food.FoodName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {food.foodDesc ||
                            food.FoodDesc ||
                            "Món ăn dinh dưỡng cho bé"}
                        </p>
                        {(food.isAllergenic || food.IsAllergenic) && (
                          <span className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-2 bg-red-50 w-fit px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Dị ứng:{" "}
                            {food.allergenicNames?.join(", ") ||
                              food.AllergenicNames?.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <Utensils size={40} className="mx-auto mb-2 opacity-20" />
                    <p>Không có thông tin món ăn</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-gray-50">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="feedback"
            className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=active]:flex"
          >
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-4">
                  <h4 className="text-orange-800 font-semibold text-sm mb-1 flex items-center gap-2">
                    <MessageSquare size={16} /> Góp ý của phụ huynh
                  </h4>
                  <p className="text-xs text-orange-600">
                    Ý kiến của quý phụ huynh giúp nhà trường cải thiện chất
                    lượng bữa ăn cho các bé.
                  </p>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung góp ý:
                </label>
                <Textarea
                  placeholder="Ví dụ: Bé rất thích món gà hôm nay, nhưng canh hơi nhạt..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  className="min-h-[200px] resize-none focus-visible:ring-orange-500 p-3 text-base"
                />
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-white">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base shadow-lg shadow-orange-200"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedbackContent.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                Gửi phản hồi ngay
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
