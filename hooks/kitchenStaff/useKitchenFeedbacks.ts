import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { FeedbackDto, FeedbackSearchParams } from "@/types/kitchen-feedback";

export const useKitchenFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDto | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [filters, setFilters] = useState<FeedbackSearchParams>({
    sortBy: "CreatedAt",
    sortDesc: true,
  });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.targetType && filters.targetType !== "all")
        params.append("targetType", filters.targetType);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      params.append("sortDesc", String(filters.sortDesc));

      const res = await axiosInstance.get<FeedbackDto[]>(
        `/Feedbacks?${params.toString()}`
      );
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Lỗi tải feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get<FeedbackDto>(`/Feedbacks/${id}`);
      setSelectedFeedback(res.data);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);
  return {
    feedbacks,
    loading,
    refresh: fetchFeedbacks,
    onSearch: (term: string) =>
      setFilters((prev) => ({ ...prev, keyword: term })),
    onFilterType: (type: string) =>
      setFilters((prev) => ({ ...prev, targetType: type })),
    selectedFeedback,
    onSelectFeedback: fetchFeedbackDetail,
    loadingDetail,
    onClearDetail: () => setSelectedFeedback(null),
  };
};
