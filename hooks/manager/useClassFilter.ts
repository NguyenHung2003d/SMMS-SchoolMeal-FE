"use client";
import { useState, useMemo } from "react";
import { ClassDto } from "@/types/manager-class";

export const useClassFilter = (classes: ClassDto[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch = cls.className
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesYear =
        selectedYear === "all" || cls.yearId === parseInt(selectedYear);
      return matchesSearch && matchesYear;
    });
  }, [classes, searchQuery, selectedYear]);

  return {
    searchQuery,
    setSearchQuery,
    selectedYear,
    setSelectedYear,
    filteredClasses,
  };
};
