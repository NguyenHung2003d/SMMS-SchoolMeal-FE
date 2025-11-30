"use client";
import React, { useState } from "react";
import ClassToolbar from "@/components/manager/class/ClassToolbar";
import ClassList from "@/components/manager/class/ClassList";
import ClassFormModal from "@/components/manager/class/ClassFormModal";
import DeleteClassModal from "@/components/manager/class/DeleteClassModal";
import { ClassDto } from "@/types/manager-class";

import { useClassData } from "@/hooks/manager/useClassData";
import { useClassMutations } from "@/hooks/manager/useClassMutations";
import { useClassFilter } from "@/hooks/manager/useClassFilter";

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
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassDto | null>(null);

  const openAddModal = () => {
    setEditingClass(null);
    setShowFormModal(true);
  };

  const openEditModal = (cls: ClassDto) => {
    setEditingClass(cls);
    setShowFormModal(true);
  };

  const onSubmitForm = async (formData: any) => {
    await handleFormSubmit(formData, editingClass, () =>
      setShowFormModal(false)
    );
  };

  const onConfirmDelete = () => {
    if (classToDelete) {
      handleDeleteClass(classToDelete.classId, () => setClassToDelete(null));
    }
  };

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

      <DeleteClassModal
        classData={classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
