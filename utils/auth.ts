export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem("accessToken");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    return null;
  }
  
  return token;
};