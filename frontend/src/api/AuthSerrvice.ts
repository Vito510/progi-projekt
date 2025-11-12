export interface UserResponse {
    authenticated: boolean;
    name?: string;
    email?: string;
  }
  
  export async function fetchCurrentUser(): Promise<UserResponse> {
    const res = await fetch("/me", { 
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
    window.location.href = "/logout";
  }