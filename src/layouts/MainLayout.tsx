import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import useAuthStore from "../stores/auth";
import { ROLE_MAP } from "../utils/map";

export default function MainLayout() {
  const { user, reset } = useAuthStore();
  const signOut = () => {
    reset();
  };
  const navigate = useNavigate();
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col h-dvh w-full">
        <div className="h-20 flex justify-between items-center p-2 border-1 border-x-0">
          <div className="w-1/3"></div>
          <div className="px-4 flex items-center gap-4">
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: user?.picture,
                  }}
                  className="transition-transform"
                  description={ROLE_MAP[user?.account.role.role]}
                  name={user?.first_name + " " + user?.last_name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  onClick={() => {
                    navigate("/profile");
                  }}
                  key="settings"
                >
                  Hồ sơ
                </DropdownItem>
                <DropdownItem
                  onClick={() => signOut()}
                  key="logout"
                  color="danger"
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="h-full p-4 overflow-auto relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
