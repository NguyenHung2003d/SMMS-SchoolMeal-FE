"use client";
import React, { useState } from "react";
import { Search, Plus, Edit, Trash, Users, X, Save } from "lucide-react";
import { initialClasses } from "@/data/school/classes";
import { initialStudents } from "@/data/school/students";
import { teachers } from "@/data/school/teachers";

export default function ManagerClasses() {
  const [classes, setClasses] = useState(initialClasses);
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentClassId, setCurrentClassId] = useState(null);

  // Updated classForm state to match API spec
  const [classForm, setClassForm] = useState({
    className: "", // Was 'name'
    yearId: "", // Was 'grade', corresponds to 'yearId'
    teacherId: "", // Was 'teacherName'
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    gender: "Nam",
    dob: "",
  });

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGrade === "all" || cls.grade === parseInt(selectedGrade))
  );

  const getClassStudents = (classId: any) =>
    students.filter((s) => s.classId === classId);
  const getCurrentClass = () => classes.find((c) => c.id === currentClassId);

  // Helper to get teacher name from ID for display
  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "N/A";
  };

  // Updated to build payload matching the API spec
  const handleAddClass = () => {
    if (!classForm.className || !classForm.yearId || !classForm.teacherId) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // This is the payload you would send to your API
    const newClassPayload = {
      className: classForm.className,
      schoolId: "4B9B86C9-620E-455A-9884-120B91B5FE9F", // Hardcoded from example
      yearId: parseInt(classForm.yearId),
      teacherId: classForm.teacherId,
      createdBy: "CFB2CDF0-646B-48C1-86D6-5882A0C41E85", // Hardcoded from example
    };

    const newClassForState = {
      id: Math.max(...classes.map((c) => c.id), 0) + 1,
      name: newClassPayload.className, // Map 'className' to 'name' for UI
      grade: newClassPayload.yearId, // Map 'yearId' to 'grade' for UI
      year: "2023-2024", // Default year
      teacherId: newClassPayload.teacherId,
    };

    setClasses([...classes, newClassForState]);

    setClassForm({ className: "", yearId: "", teacherId: "" });
    setShowAddClassModal(false);
  };

  // Updated to build payload matching the API spec
  const handleUpdateClass = () => {
    if (!classForm.className || !classForm.yearId || !classForm.teacherId) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // This is the payload you would send to your API
    const updateClassPayload = {
      className: classForm.className,
      // Assuming you'd get these from the `editingClass` object
      schoolId: editingClass.schoolId || "4B9B86C9-620E-455A-9884-120B91B5FE9F",
      yearId: parseInt(classForm.yearId),
      teacherId: classForm.teacherId,
      createdBy:
        editingClass.createdBy || "CFB2CDF0-646B-48C1-86D6-5882A0C41E85",
    };

    // console.log("Update Class API Payload:", updateClassPayload);

    // --- For Demo: Update local state ---
    setClasses(
      classes.map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              name: updateClassPayload.className,
              grade: updateClassPayload.yearId,
              teacherId: updateClassPayload.teacherId,
            }
          : c
      )
    );
    // --- End Demo ---

    setEditingClass(null);
    setClassForm({ className: "", yearId: "", teacherId: "" });
    setShowEditClassModal(false);
  };

  const handleDeleteClass = (id: any) => {
    // Note: In a real app, you'd send a DELETE request to your API
    if (window.confirm("Bạn có chắc muốn xóa lớp học này?")) {
      setClasses(classes.filter((c) => c.id !== id));
      setStudents(students.filter((s) => s.classId !== id));
    }
  };

  // Updated to populate form based on new API structure
  const openEditClassModal = (cls: any) => {
    setEditingClass(cls);
    setClassForm({
      className: cls.name, // Map 'name' back to 'className'
      yearId: cls.grade.toString(), // Map 'grade' back to 'yearId'
      teacherId: cls.teacherId,
    });
    setShowEditClassModal(true);
  };

  // --- Student functions (unchanged, but use window.confirm) ---
  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      gender: student.gender,
      dob: student.dob,
    });
  };

  const handleSaveStudent = () => {
    if (!studentForm.name || !studentForm.dob) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setStudents(
      students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: studentForm.name,
              gender: studentForm.gender,
              dob: studentForm.dob,
            }
          : s
      )
    );
    setEditingStudent(null);
    setStudentForm({ name: "", gender: "Nam", dob: "" });
  };

  const handleDeleteStudent = (id: any) => {
    if (window.confirm("Bạn có chắc muốn xóa học sinh này?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleViewStudents = (cls: any) => {
    setCurrentClassId(cls.id);
    setShowStudentsModal(true);
  };

  // Helper function to reset the modal form
  const resetClassForm = () => {
    setEditingClass(null);
    setClassForm({ className: "", yearId: "", teacherId: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý lớp học</h1>
          <p className="text-gray-600">Tạo và quản lý lớp học, học sinh</p>
        </div>
        <button
          onClick={() => {
            resetClassForm();
            setShowAddClassModal(true);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Tạo lớp
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="all">Tất cả khối</option>
            {[1, 2, 3, 4, 5].map((g) => (
              <option key={g} value={g}>
                Khối {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => {
            resetClassForm();
            setShowAddClassModal(true);
          }}
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-64 hover:border-orange-400 transition-colors cursor-pointer"
        >
          <div className="bg-blue-100 rounded-full p-4 mb-3">
            <Plus size={24} className="text-orange-500" />
          </div>
          <p className="font-medium text-gray-800">Tạo lớp học mới</p>
        </div>

        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    Lớp {cls.name}
                  </h3>
                  {/* Updated to find name by ID */}
                  <p className="text-sm text-gray-600">
                    {getTeacherName(cls.teacherId)}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Khối {cls.grade}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 mb-4">
                {" "}
                {/* Removed 'room' column */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Học sinh</p>
                  <p className="font-bold text-lg">
                    {getClassStudents(cls.id).length}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => openEditClassModal(cls)}
                  className="flex-1 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center justify-center text-sm"
                >
                  <Edit size={16} className="mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="flex-1 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-center text-sm"
                >
                  <Trash size={16} className="mr-1" />
                  Xóa
                </button>
              </div>
              <button
                onClick={() => handleViewStudents(cls)}
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center text-sm"
              >
                <Users size={16} className="mr-1" />
                Xem học sinh
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Class Modal */}
      {(showAddClassModal || showEditClassModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingClass ? "Sửa lớp học" : "Tạo lớp học"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddClassModal(false);
                    setShowEditClassModal(false);
                    resetClassForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={classForm.className}
                    onChange={(e) =>
                      setClassForm({ ...classForm, className: e.target.value })
                    }
                    placeholder="Ví dụ: 1A, 2B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khối (Năm học)
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={classForm.yearId}
                    onChange={(e) =>
                      setClassForm({ ...classForm, yearId: e.target.value })
                    }
                  >
                    <option value="">Chọn khối</option>
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giáo viên
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={classForm.teacherId}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        teacherId: e.target.value,
                      })
                    }
                  >
                    <option value="">Chọn giáo viên</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {" "}
                        {/* Value is now t.id */}
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 'room' field removed */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setShowAddClassModal(false);
                      setShowEditClassModal(false);
                      resetClassForm();
                    }}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={editingClass ? handleUpdateClass : handleAddClass}
                    className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    {editingClass ? "Cập nhật" : "Tạo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal (Largely unchanged) */}
      {showStudentsModal && getCurrentClass() && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Danh sách lớp {getCurrentClass().name}
              </h2>
              <button
                onClick={() => setShowStudentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {getClassStudents(currentClassId).length > 0 ? (
                <div className="space-y-3">
                  {getClassStudents(currentClassId).map((student) => (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {editingStudent?.id === student.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tên
                              </label>
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentForm.name}
                                onChange={(e) =>
                                  setStudentForm({
                                    ...studentForm,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Giới tính
                              </label>
                              <select
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentForm.gender}
                                onChange={(e) =>
                                  setStudentForm({
                                    ...studentForm,
                                    gender: e.target.value,
                                  })
                                }
                              >
                                <option>Nam</option>
                                <option>Nữ</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Ngày sinh
                              </label>
                              <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentForm.dob}
                                onChange={(e) =>
                                  setStudentForm({
                                    ...studentForm,
                                    dob: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveStudent}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center"
                            >
                              <Save size={14} className="mr-1" />
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingStudent(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student.gender} | {student.dob}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Phụ huynh: {student.parentName}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Không có học sinh
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 text-right">
              <button
                onClick={() => setShowStudentsModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
