import useAuthStore from "../../stores/auth";
import dayjs from "../../libs/dayjs";
import { Divider } from "@nextui-org/divider";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useNavigate } from "react-router";
import { AiOutlineHome, AiOutlineUserSwitch } from "react-icons/ai";
import { GiBunkBeds } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { IResponseData, StatisticOverview } from "../../types";
export default function StaffDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const axios = useAxiosIns();

  const getStatisticOverviewQuery = useQuery({
    queryKey: ["fetch/statisticOverview"],
    queryFn: () =>
      axios.get<IResponseData<StatisticOverview>>("/api/v1/statistic/overview"),
    refetchOnWindowFocus: false,
  });

  const statistic = getStatisticOverviewQuery.data?.data?.data;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full">
        <div className="text-xl font-semibold">
          Xin chào, {user?.first_name} {user?.last_name}
        </div>
        <div className="capitalize text-sm text-gray-500">
          {dayjs().format("dddd, MMMM [ngày] D, YYYY")}
        </div>
      </div>
      <Divider />
      <div className="flex flex-wrap gap-4 justify-center">
        <Card
          radius="sm"
          className="p-5"
          isPressable
          onPress={() => {
            navigate("/staff/rooms");
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
              <AiOutlineHome size={24} />
            </div>
            <div>
              <CardHeader className="py-2">
                <strong>Trạng thái phòng</strong>
              </CardHeader>

              <CardBody className="py-0 flex flex-row gap-8">
                <div>
                  <div className="text-sm text-gray-500">Số dãy phòng</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalRegions}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tổng số phòng</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalRooms}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Đang sửa chữa</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalMaintainingRooms}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phòng trống</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalEmptyRooms}
                  </div>
                </div>
              </CardBody>
            </div>
          </div>
        </Card>
        <Card
          radius="sm"
          className="p-5"
          isPressable
          onPress={() => {
            navigate("/staff/room-types");
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
              <GiBunkBeds size={24} />
            </div>
            <div>
              <CardHeader className="py-2">
                <strong>Loại phòng</strong>
              </CardHeader>
              <CardBody className="py-0 flex flex-wrap flex-row gap-8">
                <>
                  {statistic?.roomTypeStatistics.map((roomType, i) => (
                    <>
                      <div key={"::" + i}>
                        <div className="text-sm text-gray-500">
                          {roomType.name}
                        </div>
                        <div className="text-2xl font-semibold">
                          {roomType.totalRooms}
                        </div>
                      </div>
                    </>
                  ))}
                </>
              </CardBody>
            </div>
          </div>
        </Card>
        <Card
          radius="sm"
          className="p-5"
          isPressable
          onPress={() => {
            navigate("/staff/students");
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
              <AiOutlineUserSwitch size={24} />
            </div>
            <div>
              <CardHeader className="py-2">
                <strong>Sinh viên</strong>
              </CardHeader>
              <CardBody className="py-0 flex flex-row gap-8">
                <div>
                  <div className="text-sm text-gray-500">Tổng số sinh viên</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalStudents}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    Sinh viên đang lưu trú
                  </div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalBookedStudents}
                  </div>
                </div>
              </CardBody>
            </div>
          </div>
        </Card>
        <Card
          radius="sm"
          className="p-5"
          isPressable
          onPress={() => {
            navigate("/staff/invoices");
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
              <LiaFileInvoiceDollarSolid size={24} />
            </div>
            <div>
              <CardHeader className="py-2">
                <strong>Hóa đơn</strong>
              </CardHeader>
              <CardBody className="py-0 flex flex-row gap-8">
                <div>
                  <div className="text-sm text-gray-500">Tổng hóa đơn</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalInvoices}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cần thanh toán</div>
                  <div className="text-2xl font-semibold">
                    {statistic?.totalUnpaidInvoices}
                  </div>
                </div>
              </CardBody>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
