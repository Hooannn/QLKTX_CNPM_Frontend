import { Divider, Image } from "@nextui-org/react";
import useAuthStore from "../../stores/auth";
import dayjs from "../../libs/dayjs";
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
          <div className="w-full flex flex-col items-center py-12 gap-4">
            <Image src="/Empty.svg" width={200} />
            <small>Bạn hiện tại chưa thuê phòng nào.</small>
          </div>
        </div>
      </div>
    </>
  );
}
