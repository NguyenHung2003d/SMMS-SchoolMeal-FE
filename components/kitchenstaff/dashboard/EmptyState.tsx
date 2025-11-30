import React from "react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-6">
      <p className="text-gray-400 text-sm italic">{message}</p>
    </div>
  );
};
