"use client";
import { useState, useEffect, useCallback } from "react";
import { kitchenFeedbackService } from "@/services/kitchenFeedback.service";
import {
  FeedbackDto,
  FeedbackDetailDto,
  FeedbackSearchParams,
} from "@/types/kitchen-feedback";

export const useKitchenFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<FeedbackSearchParams>({
    keyword: "",
    sortDesc: true,
    sortBy: "CreatedAt",
  });

  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackDetailDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await kitchenFeedbackService.searchFeedbacks(searchParams);
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to fetch feedbacks", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const fetchFeedbackDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const data = await kitchenFeedbackService.getFeedbackById(id);
      setSelectedFeedback(data);
    } catch (error) {
      console.error("Failed to fetch feedback detail", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchParams((prev) => ({ ...prev, keyword }));
  };

  const clearDetail = () => setSelectedFeedback(null);

  return {
    feedbacks,
    loading,
    selectedFeedback,
    loadingDetail,
    refresh: fetchFeedbacks,
    onSearch: handleSearch,
    onSelectFeedback: fetchFeedbackDetail,
    onClearDetail: clearDetail,
  };
};
