import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  AiOutlineDashboard,
  AiOutlineUsergroupAdd,
  AiOutlineBars,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";

import { MdOutlineDiscount } from "react-icons/md";
import { GiBunkBeds } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { Button, Image } from "@nextui-org/react";
import { Role } from "../types";
import { GrDocumentUser } from "react-icons/gr";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const onMenuItemClick = (item: {
    to: string;
    label: string;
    icon: JSX.Element;
  }) => {
    navigate(item.to);
  };

  const menuItems = useMemo(() => {
    switch (user?.account.role) {
      case Role.STUDENT:
        return [
          {
            to: "/student",
            icon: <AiOutlineHome size={25} />,
            label: "Thuê phòng",
          },
          {
            to: "/student/rooms",
            icon: <AiOutlineSearch size={25} />,
            label: "Tra cứu phòng",
          },
          {
            to: "/student/invoices",
            icon: <LiaFileInvoiceDollarSolid size={25} />,
            label: "Hoá đơn",
          },
        ];
      case Role.STAFF:
        return [
          {
            to: "/staff",
            icon: <AiOutlineDashboard size={25} />,
            label: "Trang chủ",
          },
          {
            to: "/staff/rooms",
            icon: <AiOutlineHome size={25} />,
            label: "Dãy và phòng",
          },
          {
            to: "/staff/room-types",
            icon: <GiBunkBeds size={25} />,
            label: "Loại phòng",
          },
          {
            to: "/staff/booking-time",
            icon: <AiOutlineClockCircle size={25} />,
            label: "Thời gian thuê",
          },
          {
            to: "/staff/bookings",
            icon: <GrDocumentUser size={25} />,
            label: "Phiếu thuê",
          },
          {
            to: "/staff/invoices",
            icon: <LiaFileInvoiceDollarSolid size={25} />,
            label: "Hoá đơn",
          },
          {
            to: "/staff/discount",
            icon: <MdOutlineDiscount size={25} />,
            label: "Giảm giá",
          },
          {
            to: "/staff/students",
            icon: <AiOutlineSearch size={25} />,
            label: "Tra cứu sinh viên",
          },
        ];
      default:
        return [
          {
            to: "/staff",
            icon: <AiOutlineDashboard size={25} />,
            label: "Trang chủ",
          },
          {
            to: "/staff/rooms",
            icon: <AiOutlineHome size={25} />,
            label: "Dãy và phòng",
          },
          {
            to: "/staff/room-types",
            icon: <GiBunkBeds size={25} />,
            label: "Loại phòng",
          },
          {
            to: "/staff/booking-time",
            icon: <AiOutlineClockCircle size={25} />,
            label: "Thời gian thuê",
          },
          {
            to: "/staff/bookings",
            icon: <GrDocumentUser size={25} />,
            label: "Phiếu thuê",
          },
          {
            to: "/staff/invoices",
            icon: <LiaFileInvoiceDollarSolid size={25} />,
            label: "Hoá đơn",
          },
          {
            to: "/staff/discount",
            icon: <MdOutlineDiscount size={25} />,
            label: "Giảm giá",
          },
          {
            to: "/staff/students",
            icon: <AiOutlineSearch size={25} />,
            label: "Tra cứu sinh viên",
          },
          {
            to: "/students-management",
            icon: <AiOutlineUsergroupAdd size={25} />,
            label: "Quản lý sinh viên",
          },
          {
            to: "/staffs-management",
            icon: <FaUserTie size={25} />,
            label: "Quản lý nhân viên",
          },
        ];
    }
  }, [user]);

  useEffect(() => {
    setActiveTab(
      menuItems.find((item) => item.to === location.pathname)?.label as string
    );
  }, [location]);
  return (
    <>
      <ProSidebar collapsed={collapsed} collapsedWidth="100px">
        <div className="h-full flex flex-col align-center px-3">
          <Button
            onClick={() => setCollapsed(!collapsed)}
            isIconOnly
            className="absolute top-4 right-[-20px]"
          >
            <AiOutlineBars className="w-4 h-4" />
          </Button>
          <div className="w-full py-8">
            <Image
              className="mx-auto"
              removeWrapper
              width={collapsed ? 50 : 80}
              src="/logo.png"
              alt="logo"
            />
          </div>
          <Menu
            menuItemStyles={{
              button: ({ level, active }) => {
                if (level === 0)
                  return {
                    color: active ? "rgb(3 105 161)" : "silver",
                    backgroundColor: active ? "rgb(186 230 253)" : undefined,
                    borderRadius: "12px",
                    margin: "4px 0",
                  };
              },
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => onMenuItemClick(item)}
                active={activeTab === item.label}
                icon={item.icon}
              >
                {!collapsed && (
                  <div className="text-sm font-medium">{item.label}</div>
                )}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </ProSidebar>
    </>
  );
}
