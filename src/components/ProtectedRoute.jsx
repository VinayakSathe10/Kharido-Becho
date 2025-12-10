import { Navigate } from "react-router-dom";

const normalize = (roles = []) =>
  roles.map((r) => r.replace(/^ROLE_/i, "").toUpperCase());

function parseRoles(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return raw.split(",").map((r) => r.trim());
  }
}

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const roles = normalize(parseRoles(localStorage.getItem("roles")));
    if (!roles.includes(requiredRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
