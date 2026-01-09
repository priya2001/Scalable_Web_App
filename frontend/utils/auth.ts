import { redirect } from 'next/navigation';

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

// Note: This logout function won't work in server components
// For server components, use the logout functionality in AuthProvider
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};
  