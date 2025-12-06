"use client";
import React, { useState, useCallback } from "react";
import ClassToolbar from "@/components/manager/class/ClassToolbar";
import ClassList from "@/components/manager/class/ClassList";
import ClassFormModal from "@/components/manager/class/ClassFormModal";
import DeleteClassModal from "@/components/manager/class/DeleteClassModal";
import { ClassDto } from "@/types/manager-class";

import { useClassData } from "@/hooks/manager/useClassData";
import { useClassMutations } from "@/hooks/manager/useClassMutations";
import { useClassFilter } from "@/hooks/manager/useClassFilter";
import AcademicYearManagerModal from "@/components/manager/class/AcademicYearManagerModal";

export default function ManagerClasses() {
  const {
    classes,
    teachers,
    freeTeachers,
    academicYears,
    loading,
    isRefreshing,
    refreshData,
    fetchData,
  } = useClassData();

  const {
    searchQuery,
    setSearchQuery,
    selectedYear,
    setSelectedYear,
    filteredClasses,
  } = useClassFilter(classes);

  const { handleFormSubmit, handleDeleteClass } = useClassMutations({
    onSuccess: fetchData,
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassDto | null>(null);

  const openAddModal = useCallback(() => {
    setEditingClass(null);
    setShowFormModal(true);
  }, []);

  const openEditModal = useCallback((cls: ClassDto) => {
    setEditingClass(cls);
    setShowFormModal(true);
  }, []);

  const onSubmitForm = useCallback(
    async (formData: any) => {
      await handleFormSubmit(formData, editingClass, () =>
        setShowFormModal(false)
      );
    },
    [handleFormSubmit, editingClass]
  );

  const onConfirmDelete = useCallback(() => {
    if (classToDelete) {
      handleDeleteClass(classToDelete.classId, () => setClassToDelete(null));
    }
  }, [classToDelete, handleDeleteClass]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ClassToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        academicYears={academicYears}
        onAddClick={openAddModal}
        handleRefresh={refreshData}
        onManageYears={() => setShowYearModal(true)}
        isRefreshing={isRefreshing}
        loading={loading}
      />

      <ClassList
        loading={loading}
        classes={filteredClasses}
        academicYears={academicYears}
        onEdit={openEditModal}
        onDelete={setClassToDelete}
      />

      {showFormModal && (
        <ClassFormModal
          onClose={() => setShowFormModal(false)}
          onSubmit={onSubmitForm}
          editingClass={editingClass}
          academicYears={academicYears}
          teachers={teachers}
          freeTeachers={freeTeachers}
        />
      )}

      {classToDelete && (
        <DeleteClassModal
          classData={classToDelete}
          onClose={() => setClassToDelete(null)}
          onConfirm={onConfirmDelete}
        />
      )}

      {showYearModal && (
        <AcademicYearManagerModal
          onClose={() => setShowYearModal(false)}
          onRefresh={refreshData}
        />
      )}
    </div>
  );
}
