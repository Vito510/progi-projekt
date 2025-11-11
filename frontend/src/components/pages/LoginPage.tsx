import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}