import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  AiOutlineDashboard,
  AiOutlineCarryOut,
  AiOutlineUsergroupAdd,
  AiOutlineBars,
} from "react-icons/ai";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { Button, Image } from "@nextui-org/react";
import { Role } from "../types";
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
    switch (user?.role) {
      case Role.STUDENT:
        return [
          {
            to: "/student",
            icon: <AiOutlineDashboard size={25} />,
            label: "Thuê phòng",
          },
          {
            to: "/student/rooms",
            icon: <AiOutlineCarryOut size={25} />,
            label: "Tra cứu phòng",
          },
          {
            to: "/student/requests",
            icon: <AiOutlineCarryOut size={25} />,
            label: "Tra cứu yêu cầu",
          },
          {
            to: "/student/invoices",
            icon: <AiOutlineCarryOut size={25} />,
            label: "Tra cứu hoá đơn",
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
            icon: <AiOutlineDashboard size={25} />,
            label: "Quản lý phòng",
          },
          {
            to: "/staff/invoices",
            icon: <AiOutlineDashboard size={25} />,
            label: "Quản lý hoá đơn",
          },
          {
            to: "/staff/regions",
            icon: <AiOutlineDashboard size={25} />,
            label: "Quản lý dãy phòng",
          },
          {
            to: "/staff/requests",
            icon: <AiOutlineDashboard size={25} />,
            label: "Duyệt yêu cầu",
          },
          {
            to: "/staff/students",
            icon: <AiOutlineCarryOut size={25} />,
            label: "Tra cứu thông tin sinh viên",
          },
        ];
      default:
        return [
          {
            to: "/users-management",
            icon: <AiOutlineUsergroupAdd size={25} />,
            label: "Quản lý người dùng",
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
