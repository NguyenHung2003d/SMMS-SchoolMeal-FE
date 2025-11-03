"use client";

import AllergyAlerts from "./AllergyAlerts";
import LowStockItems from "./LowStockItems";
import MenuItemsTable from "./MenuItemsTable";
import RecentUpdates from "./RecentUpdates";
import StatsOverview from "./StatsOverview";
import UpcomingMeals from "./UpcomingMeals";

export default function OverviewTab() {
  return (
    <>
      <StatsOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingMeals />
          <MenuItemsTable />
        </div>
        <div className="space-y-6">
          <AllergyAlerts />
          <LowStockItems />
          <RecentUpdates />
        </div>
      </div>
    </>
  );
}
