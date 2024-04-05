import useAuthStore from "../../stores/auth";
import { Navigate } from "react-router-dom";
import { Role } from "../../types";
export default function DashboardPage() {
  const { user } = useAuthStore();
  const redirectPath = () => {
    switch (user?.account.role.role) {
      case Role.STUDENT:
        return "/student";
      default:
        return "/staff";
    }
  };
  return <Navigate to={redirectPath()} replace />;
}
