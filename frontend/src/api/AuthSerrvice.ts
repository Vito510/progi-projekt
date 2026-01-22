export interface UserResponse {
    authenticated: boolean;
    name?: string;
    email?: string;
    role?: "USER" | "ADMIN";
  }
  
  export async function fetchCurrentUser(): Promise<UserResponse> {
    const res = await fetch("/api/me", { 
      credentials: "include", 
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}` } 
    }); 
    if (!res.ok) {
      return { authenticated: false };
    }
    return res.json();
  }
  
  export function loginWithGoogle() {
    window.location.href = "/auth/google";
  }
  
  export function logout() {
    sessionStorage.removeItem("authToken")
    window.location.href = "/";
  }