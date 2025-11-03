"use client";
import { Star, User, ThumbsUp, MessageSquare } from "lucide-react";

export default function ParentFeedbackSection({
  averageRating,
  ratingCounts,
  parentFeedbacks,
  filteredParentFeedback,
  parentFeedbackTab,
  setParentFeedbackTab,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center">
          <User className="mr-2 text-orange-500" size={20} />
          Đánh giá từ phụ huynh
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Rating Summary */}
        <div className="bg-orange-50 rounded-lg p-5 border border-orange-100">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Tổng quan đánh giá
          </h3>
          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold text-orange-500 mr-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({parentFeedbacks.length} đánh giá)
            </span>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <div className="w-8 text-sm text-gray-600">{star} sao</div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          (ratingCounts[star - 1] / parentFeedbacks.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 w-8 text-right">
                  {ratingCounts[star - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent Feedback List */}
        <div className="lg:col-span-2">
          <div className="flex mb-4 border-b border-gray-200">
            <button
              onClick={() => setParentFeedbackTab("recent")}
              className={`px-4 py-2 text-sm font-medium ${
                parentFeedbackTab === "recent"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Gần đây
            </button>
            <button
              onClick={() => setParentFeedbackTab("positive")}
              className={`px-4 py-2 text-sm font-medium ${
                parentFeedbackTab === "positive"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tích cực
            </button>
            <button
              onClick={() => setParentFeedbackTab("negative")}
              className={`px-4 py-2 text-sm font-medium ${
                parentFeedbackTab === "negative"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Cần cải thiện
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {filteredParentFeedback.map((feedback: any) => (
              <div
                key={feedback.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={feedback.parent.avatar}
                        alt={feedback.parent.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{feedback.parent.name}</div>
                      <div className="text-xs text-gray-500">
                        Phụ huynh của {feedback.parent.child} - Lớp{" "}
                        {feedback.parent.class}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= feedback.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-700 text-sm">{feedback.comment}</p>
                  {feedback.childFeedback && (
                    <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="flex items-center text-gray-600 mb-1">
                        <User size={14} className="mr-1" />
                        <span className="font-medium">Phản hồi từ bé:</span>
                      </div>
                      <p className="text-gray-700">{feedback.childFeedback}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {feedback.date} • Món: {feedback.dish}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs flex items-center text-green-600 hover:text-green-700">
                      <ThumbsUp size={14} className="mr-1" />
                      Hữu ích
                    </button>
                    <button className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                      <MessageSquare size={14} className="mr-1" />
                      Phản hồi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
