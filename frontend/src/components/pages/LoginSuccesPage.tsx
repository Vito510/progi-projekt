import { useAuth } from "../../context/AuthContext";

export default function LoginSuccessPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Pozdrav, {user?.name}!</h1>
      <p>Uspješno ste se prijavili u aplikaciju.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}