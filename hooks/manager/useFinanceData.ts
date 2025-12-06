import { useQuery } from "@tanstack/react-query";
import { managerFinanceService } from "@/services/manager/managerFinance.service";
import { managerPurchasesService } from "@/services/manager/managerPurchases.service";
import { useDebounce } from "@/hooks/useDebounce";

export const useFinanceData = (
  month: number,
  year: number,
  searchQuery: string,
  status: string
) => {
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: periodicData, isLoading: loadingStats } = useQuery({
    queryKey: ["finance-periodic", month, year],
    queryFn: async () => {
      const [summary, orders] = await Promise.all([
        managerFinanceService.getSummary(month, year),
        managerPurchasesService.getPurchaseOrders(month, year).catch(() => []),
      ]);
      return { summary, orders };
    },
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ["finance-invoices", debouncedSearch, status],
    queryFn: async () => {
      if (debouncedSearch.trim()) {
        return await managerFinanceService.searchInvoices(debouncedSearch);
      }
      if (status !== "all") {
        return await managerFinanceService.filterInvoices(status);
      }
      return await managerFinanceService.getAllInvoices();
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

  return {
    summary: periodicData?.summary || null,
    purchaseOrders: periodicData?.orders || [],
    invoices,
    loadingStats,
    loadingInvoices,
  };
};
