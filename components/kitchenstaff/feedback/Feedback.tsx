"use client";
import { useState } from "react";
import { feedbackItems, parentFeedbacks } from "@/data";
import StatsOverview from "./StatsOverview";
import ParentFeedbackSection from "./ParentFeedbackSection";
import FeedbackList from "./FeedbackList";
import FeedbackDetailModal from "./FeedbackDetailModal";

export function Feedback() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [parentFeedbackTab, setParentFeedbackTab] = useState("recent");

  // xử lý logic (giữ nguyên như code cũ)
  const averageRating =
    parentFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
    parentFeedbacks.length;
  const ratingCounts = [0, 0, 0, 0, 0];
  parentFeedbacks.forEach((f) => ratingCounts[f.rating - 1]++);

  const filteredFeedback = feedbackItems
    .filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return item.status === "pending";
      if (activeTab === "inProgress") return item.status === "inProgress";
      if (activeTab === "resolved") return item.status === "resolved";
      return true;
    })
    .filter((item) => {
      if (selectedSeverity === "all") return true;
      return item.severity === selectedSeverity;
    });

  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.date + " " + b.time).getTime() -
        new Date(a.date + " " + a.time).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.date + " " + a.time).getTime() -
        new Date(b.date + " " + b.time).getTime()
      );
    } else if (sortBy === "highSeverity") {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return (
        severityOrder[b.severity as keyof typeof severityOrder] -
        severityOrder[a.severity as keyof typeof severityOrder]
      );
    }
    return 0;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedFeedback.length / itemsPerPage);
  const paginatedFeedback = sortedFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewFeedback = (f: any) => {
    setSelectedFeedback(f);
    setIsDetailModalOpen(true);
  };

  const pendingCount = feedbackItems.filter(
    (i) => i.status === "pending"
  ).length;
  const inProgressCount = feedbackItems.filter(
    (i) => i.status === "inProgress"
  ).length;
  const resolvedCount = feedbackItems.filter(
    (i) => i.status === "resolved"
  ).length;
  const highSeverityCount = feedbackItems.filter(
    (i) => i.severity === "high"
  ).length;

  const filteredParentFeedback = parentFeedbacks.filter((f) => {
    if (parentFeedbackTab === "recent") return true;
    if (parentFeedbackTab === "positive") return f.rating >= 4;
    if (parentFeedbackTab === "negative") return f.rating <= 3;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Phản hồi & Đánh giá
      </h1>
      <StatsOverview
        pendingCount={pendingCount}
        inProgressCount={inProgressCount}
        resolvedCount={resolvedCount}
        highSeverityCount={highSeverityCount}
      />
      <ParentFeedbackSection
        averageRating={averageRating}
        ratingCounts={ratingCounts}
        parentFeedbacks={parentFeedbacks}
        filteredParentFeedback={filteredParentFeedback}
        parentFeedbackTab={parentFeedbackTab}
        setParentFeedbackTab={setParentFeedbackTab}
      />
      <FeedbackList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        sortBy={sortBy}
        setSortBy={setSortBy}
        paginatedFeedback={paginatedFeedback}
        handleViewFeedback={handleViewFeedback}
        pendingCount={pendingCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        sortedFeedback={sortedFeedback}
        itemsPerPage={itemsPerPage}
      />
      {isDetailModalOpen && selectedFeedback && (
        <FeedbackDetailModal
          selectedFeedback={selectedFeedback}
          setIsDetailModalOpen={setIsDetailModalOpen}
        />
      )}
    </div>
  );
}
