"use client";
import { useState } from "react";
import ClassesOverview from "./ClassesOverview";
import MealSchedule from "./MealSchedule";
import StudentsTable from "./StudentsTable";
import WeeklyMealCalendar from "./WeeklyMealCalendar";
import { classes, mealSchedule, students } from "@/data";
import StudentsStats from "./StudentsStats";

export default function KitchenStaffStudentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const totalStudents = students.length;
  const presentStudents = students.filter((s) => s.present).length;
  const specialRequests =
    students?.filter(
      (s) => s.note?.trim() !== "" 
    )?.length ?? 0;

  return (
    <div className="p-6">
      <StudentsStats
        totalStudents={totalStudents}
        presentStudents={presentStudents}
        specialRequests={specialRequests}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentsTable
            students={students}
            activeTab={activeTab}
            selectedClass={selectedClass}
          />
        </div>
        <div className="space-y-6">
          <ClassesOverview
            classes={classes}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
          />
          <MealSchedule
            mealSchedule={mealSchedule}
            selectedClass={selectedClass}
          />
          <WeeklyMealCalendar />
        </div>
      </div>
    </div>
  );
}
