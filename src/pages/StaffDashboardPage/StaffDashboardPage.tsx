import useAuthStore from "../../stores/auth";
import dayjs from '../../libs/dayjs'
import { Divider } from "@nextui-org/divider";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useNavigate } from "react-router";
import { AiOutlineHome, AiOutlineUserSwitch } from "react-icons/ai";
import { GiBunkBeds } from "react-icons/gi";
import { CiSquareQuestion } from "react-icons/ci";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
export default function StaffDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  return <div className="flex flex-col gap-4 h-full">
    <div className="w-full">
      <div className="text-xl font-semibold">Xin chào, {user?.first_name} {user?.last_name}</div>
      <div className="capitalize text-sm text-gray-500">{dayjs().format('dddd, MMMM [ngày] D, YYYY')}</div>
    </div>
    <Divider />
    <div className="flex flex-wrap gap-4 justify-center">
      <Card radius='sm' className="p-5" isPressable onPress={() => {
        navigate('/staff/rooms')
      }}>
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
                <div className="text-2xl font-semibold">4</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tổng số phòng</div>
                <div className="text-2xl font-semibold">96</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Đang sửa chữa</div>
                <div className="text-2xl font-semibold">3</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phòng trống</div>
                <div className="text-2xl font-semibold">50</div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
      <Card radius='sm' className="p-5" isPressable onPress={() => {
        navigate('/staff/room-types')
      }}>
        <div className="flex gap-2 items-center">
          <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
            <GiBunkBeds size={24} />
          </div>
          <div>
            <CardHeader className="py-2">
              <strong>Loại phòng</strong>
            </CardHeader>
            <CardBody className="py-0 flex flex-row gap-8">
              <div>
                <div className="text-sm text-gray-500">Phòng thường</div>
                <div className="text-2xl font-semibold">96</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phòng dịch vụ</div>
                <div className="text-2xl font-semibold">3</div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
      <Card radius='sm' className="p-5" isPressable onPress={() => {
        navigate('/staff/students')
      }}>
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
                <div className="text-2xl font-semibold">200</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Sinh viên đang lưu trú</div>
                <div className="text-2xl font-semibold">60</div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
      <Card radius='sm' className="p-5" isPressable onPress={() => {
        navigate('/staff/request')
      }}>
        <div className="flex gap-2 items-center">
          <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
            <CiSquareQuestion size={24} />
          </div>
          <div>

            <CardHeader className="py-2">
              <strong>Yêu cầu</strong>
            </CardHeader>
            <CardBody className="py-0 flex flex-row gap-8">
              <div>
                <div className="text-sm text-gray-500">Thuê</div>
                <div className="text-2xl font-semibold">12</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Chuyển phòng</div>
                <div className="text-2xl font-semibold">1</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Gia hạn</div>
                <div className="text-2xl font-semibold">2</div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
      <Card radius='sm' className="p-5" isPressable onPress={() => {
        navigate('/staff/invoices')
      }}>
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
                <div className="text-2xl font-semibold">12</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Cần thanh toán</div>
                <div className="text-2xl font-semibold">1</div>
              </div>
            </CardBody>
          </div>
        </div>
      </Card>
    </div>
  </div>;
}
