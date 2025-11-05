export const formatCurrency = (amount: number) =>
    amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";