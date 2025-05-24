import { apiRequest } from "./queryClient";

interface AuthData {
  username: string;
  password: string;
}

export async function loginAdmin(data: AuthData): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiRequest("POST", "/api/admin/login", data);
    const result = await response.json();
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function logoutAdmin(): Promise<{ success: boolean; message?: string }> {
  try {
    await apiRequest("POST", "/api/admin/logout", {});
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/check-auth", {
      credentials: "include"
    });
    
    if (!response.ok) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
