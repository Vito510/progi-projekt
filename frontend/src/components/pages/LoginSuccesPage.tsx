import { useAuth } from "../../context/AuthContext";

export default function LoginSuccessPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Pozdrav, {user?.name}!</h1>
      <p>Uspješno ste se prijavili u aplikaciju.</p>
    </div>
  );
}