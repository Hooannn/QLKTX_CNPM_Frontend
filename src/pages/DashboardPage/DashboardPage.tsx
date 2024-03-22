import useAuthStore from "../../stores/auth";
import { Navigate } from "react-router-dom";
import { Role } from "../../types";
export default function DashboardPage() {
  const { user } = useAuthStore();
  const redirectPath = () => {
    switch (user?.account.role) {
      case Role.STUDENT:
        return "/student";
      case Role.STAFF:
        return "/staff";
      default:
        return "/users-management";
    }
  };
  return <Navigate to={redirectPath()} replace />;
}
