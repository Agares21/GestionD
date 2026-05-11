import { useAuthStore } from "@store/authStore";
import { UserRole } from "@types";
import { useNavigate } from "react-router-dom";

export const useRequireRole = (requiredRoles: UserRole[]) => {
  const { hasRole } = useAuthStore();
  const navigate = useNavigate();

  if (!hasRole(requiredRoles)) {
    navigate("/dashboard");
    return false;
  }

  return true;
};
