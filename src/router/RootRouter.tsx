import { Suspense } from "react";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../layouts/MainLayout";
import UsersManagementPage from "../pages/UsersManagementPage";
import StudentDashboardPage from "../pages/StaffDashboardPage/StaffDashboardPage";
import StaffDashboardPage from "../pages/StaffDashboardPage";
import StudentRoomsPage from "../pages/StudentRoomsPage";
import StudentRequestsPage from "../pages/StudentRequestsPage";
import StudentInvoicesPage from "../pages/StudentInvoicesPage";
import StaffRoomsPage from "../pages/StaffRoomsPage";
import StaffRoomTypesPage from "../pages/StaffRoomTypesPage";
import StaffInvoicesPage from "../pages/StaffInvoicesPage";
import StaffRequestsPage from "../pages/StaffRequestsPage";
import StaffStudentsPage from "../pages/StaffStudentsPage";
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
        path: "/student/rooms",
        element: <StudentRoomsPage />,
      },
      {
        path: "/student/requests",
        element: <StudentRequestsPage />,
      },
      {
        path: "/student/invoices",
        element: <StudentInvoicesPage />,
      },
      {
        path: "/staff",
        element: <StaffDashboardPage />,
      },
      {
        path: "/staff/rooms",
        element: <StaffRoomsPage />,
      },
      {
        path: "/staff/room-types",
        element: <StaffRoomTypesPage />,
      },
      {
        path: "/staff/invoices",
        element: <StaffInvoicesPage />,
      },
      {
        path: "/staff/requests",
        element: <StaffRequestsPage />,
      },
      {
        path: "/staff/students",
        element: <StaffStudentsPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
