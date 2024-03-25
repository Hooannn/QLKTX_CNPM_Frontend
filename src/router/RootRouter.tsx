import { Suspense } from "react";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../layouts/MainLayout";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StaffDashboardPage from "../pages/StaffDashboardPage";
import StudentInvoicesPage from "../pages/StudentInvoicesPage";
import RoomsPage from "../pages/RoomsPage";
import StaffRoomTypesPage from "../pages/StaffRoomTypesPage";
import StaffInvoicesPage from "../pages/StaffInvoicesPage";
import StaffStudentsPage from "../pages/StaffStudentsPage";
import StaffDiscountPage from "../pages/StaffDiscountPage";
import StaffExtraChargesPage from "../pages/StaffExtraChargesPage";
import StaffBookingTimePage from "../pages/StaffBookingTimePage";
import StaffBookingsPage from "../pages/StaffBookingsPage";
import StudentsManagementPage from "../pages/StudentsManagementPage";
import StaffsManagementPage from "../pages/StaffsManagementPage";
import ProfilePage from "../pages/ProfilePage";
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
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/staffs-management",
        element: <StaffsManagementPage />,
      },
      {
        path: "/students-management",
        element: <StudentsManagementPage />,
      },
      {
        path: "/student",
        element: <StudentDashboardPage />,
      },
      {
        path: "/student/rooms",
        element: <RoomsPage />,
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
        element: <RoomsPage />,
      },
      {
        path: "/staff/booking-time",
        element: <StaffBookingTimePage />,
      },
      {
        path: "/staff/room-types",
        element: <StaffRoomTypesPage />,
      },
      {
        path: "/staff/bookings",
        element: <StaffBookingsPage />,
      },
      {
        path: "/staff/invoices",
        element: <StaffInvoicesPage />,
      },
      {
        path: "/staff/discount",
        element: <StaffDiscountPage />,
      },
      {
        path: "/staff/extra-charges",
        element: <StaffExtraChargesPage />,
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
