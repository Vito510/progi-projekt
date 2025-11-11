export interface UserResponse {
    authenticated: boolean;
    name?: string;
    email?: string;
  }
  
  export async function fetchCurrentUser(): Promise<UserResponse> {
    const res = await fetch("https://progi-projekt.onrender.com/me", { credentials: "include" });
    if (!res.ok) {
      return { authenticated: false };
    }
    return res.json();
  }
  
  export function loginWithGoogle() {
    window.location.href = "https://progi-projekt.onrender.com/auth/google";
  }
  
  export function logout() {
    window.location.href = "https://progi-projekt.onrender.com/logout";
  }