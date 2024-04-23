import { Divider, Tab, Tabs } from "@nextui-org/react";
import useAuthStore from "../../stores/auth";
import dayjs from "../../libs/dayjs";
import CurrentBookingsTab from "./CurrentBookingsTab";
import CheckedOutBookingsTab from "./CheckedOutBookingsTab";
export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <div className="w-full flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">
              Xin chào, {user?.first_name} {user?.last_name}
            </div>
            <div className="capitalize text-sm text-gray-500">
              {dayjs().format("dddd, MMMM [ngày] D, YYYY")}
            </div>
          </div>
          <div></div>
        </div>
        <Divider />
        <div className="w-full">
          <Tabs color="primary" variant="underlined">
            <Tab key="current" title="Phiếu thuê hiện tại">
              <CurrentBookingsTab />
            </Tab>
            <Tab key="checkedOut" title="Phiếu thuê cũ">
              <CheckedOutBookingsTab />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}
