"use client";
import React, { useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import HeaderControl from "@/components/kitchenstaff/menu-create/HeaderControl";
import WeeklyGrid from "@/components/kitchenstaff/menu-create/WeeklyGrid";
import FooterControl from "@/components/kitchenstaff/menu-create/FooterControl";
import { DAYS_OF_WEEK } from "@/constants";

import ManualDishModal from "@/components/kitchenstaff/menu-create/ManualDishModal";
import AiSuggestionModal from "@/components/kitchenstaff/menu-create/AiSuggestionModal";
import MenuTemplateModal from "@/components/kitchenstaff/menu/MenuTemplateModal";
import { useMenuCreation } from "@/hooks/useMenuCreation";

export default function KitchenStaffMenuCreationPage() {
  const {
    weekStart,
    setWeekStart,
    weekEnd,
    gridData,
    submitting,
    offDates,
    isOffDay,
    addDishToGrid,
    removeDish,
    applyTemplate,
    submitMenu,
  } = useMenuCreation();

  const [modalState, setModalState] = useState({
    template: false,
    manual: false,
    ai: false,
  });
  const [context, setContext] = useState({ day: 2, mealType: "Lunch" });
  const [aiSelectedDay, setAiSelectedDay] = useState(2);

  const startTour = () => {
    driver({
      showProgress: true,
      steps: [
        {
          element: "#step-template",
          popover: {
            title: "Cách 1: Menu Mẫu",
            description:
              "Sử dụng các mẫu thực đơn có sẵn để tiết kiệm thời gian.",
          },
        },
        {
          element: "#step-ai",
          popover: {
            title: "Cách 2: AI Gợi ý",
            description: "Để AI tự động tính toán món ăn dinh dưỡng cho bạn.",
          },
        },
        {
          element: "#step-grid",
          popover: {
            title: "Cách 3: Thủ công",
            description:
              "Click trực tiếp vào các ô để tự chọn món theo ý muốn.",
          },
        },
        {
          element: "#step-submit",
          popover: {
            title: "Hoàn tất",
            description:
              "Kiểm tra lại tuần và nhấn Tạo để hệ thống lập kế hoạch mua hàng.",
          },
        },
      ],
    }).drive();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-32">
      <HeaderControl
        onOpenTemplate={() => setModalState({ ...modalState, template: true })}
        onOpenAi={() => setModalState({ ...modalState, ai: true })}
        onStartTour={startTour}
      />

      <div id="step-grid">
        <WeeklyGrid
          gridData={gridData}
          offDates={offDates}
          weekStart={weekStart}
          onRemoveDish={removeDish}
          onOpenManualAdd={(day, meal) => {
            if (!isOffDay(day)) {
              setContext({ day, mealType: meal });
              setModalState({ ...modalState, manual: true });
            }
          }}
        />
      </div>

        <FooterControl
          id="step-submit"
          weekStart={weekStart}
          weekEnd={weekEnd}
          submitting={submitting}
          onWeekStartChange={(e) => setWeekStart(e.target.value)}
          onSubmit={submitMenu}
        />

      <MenuTemplateModal
        isOpen={modalState.template}
        onClose={() => setModalState({ ...modalState, template: false })}
        onSelectTemplate={applyTemplate}
      />

      <ManualDishModal
        isOpen={modalState.manual}
        onClose={() => setModalState({ ...modalState, manual: false })}
        mealType={context.mealType}
        dayLabel={
          DAYS_OF_WEEK.find((d) => d.value === context.day)?.label || ""
        }
        onSelectDish={(dish) =>
          addDishToGrid(dish, context.day, context.mealType)
        }
      />

      <AiSuggestionModal
        isOpen={modalState.ai}
        onClose={() => setModalState({ ...modalState, ai: false })}
        onSelectDish={(dish) => {
          const type = dish.is_main_dish ? "Lunch" : "SideDish";
          addDishToGrid(
            {
              foodId: dish.food_id,
              foodName: dish.food_name,
              foodType: "",
              imageUrl: "",
            },
            aiSelectedDay,
            type
          );
        }}
        selectedDay={aiSelectedDay}
        onDayChange={setAiSelectedDay}
        daysOfWeek={DAYS_OF_WEEK}
      />
    </div>
  );
}
