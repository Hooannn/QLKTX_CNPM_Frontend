import { Suspense } from "react";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../layouts/MainLayout";
import UsersManagementPage from "../pages/UsersManagementPage";
import StudentDashboardPage from "../pages/StaffDashboardPage/StaffDashboardPage";
import StaffDashboardPage from "../pages/StaffDashboardPage";
const rootRouter = [
  {
    path: "/",
    element: (
      <Suspense>
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/users-management",
        element: <UsersManagementPage />,
      },
      {
        path: "/student",
        element: <StudentDashboardPage />,
      },
      {
        path: "/staff",
        element: <StaffDashboardPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
