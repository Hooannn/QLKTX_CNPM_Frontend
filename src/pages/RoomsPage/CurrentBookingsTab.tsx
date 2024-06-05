import {
  Avatar,
  Button,
  Card,
  CardBody,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { Booking } from "../../types";
import { SEX_MAP } from "../../utils/map";
import dayjs from "../../libs/dayjs";
import StudentDetailModal from "../StaffStudentsPage/StudentDetailModal";

export default function CurrentBookingsTab({
  bookings,
}: {
  bookings: Booking[];
}) {
  return (
    <>
      {bookings.length === 0 ? (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <Image
              removeWrapper
              className="mx-auto"
              width={200}
              src="/Empty.svg"
            />
            <div className="opacity-70">
              <small>Hiện tại không có lưu trú nào.</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {bookings.map((booking) => (
            <BookingCard booking={booking} key={booking.id} />
          ))}
        </div>
      )}
    </>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const {
    isOpen: isDetailUserModalOpen,
    onOpen: onOpenDetailUserModal,
    onClose: onDetailUserModalClose,
  } = useDisclosure();
  return (
    <>
      <StudentDetailModal
        isOpen={isDetailUserModalOpen}
        onClose={onDetailUserModalClose}
        user={{ ...booking.student, email: booking.student.account?.email }}
      />
      <Card isPressable onPress={onOpenDetailUserModal} radius="sm" shadow="sm">
        <CardBody>
          <div className="flex gap-4 items-center">
            <Avatar
              size="lg"
              className="w-16 h-16"
              fallback={<AiOutlineUser size={20} />}
            ></Avatar>
            <div className="text-center mt-2 w-[300px]">
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Mã SV:</div>
                <div className="font-semibold">{booking.student.id}</div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Tên:</div>
                <div className="font-semibold">
                  {booking.student.first_name} {booking.student.last_name}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Giới tính:</div>
                <div className="font-semibold">
                  {SEX_MAP[booking.student.sex ?? "OTHER"]}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">SĐT:</div>
                <div className="font-semibold">
                  {booking.student.phone ?? "Chưa cập nhật"}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Email:</div>
                <div className="font-semibold">{booking.student.account.email}</div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Bắt đầu:</div>
                <div className="font-semibold">
                  {dayjs(booking.booking_time.start_date).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Kết thúc:</div>
                <div className="font-semibold">
                  {dayjs(booking.booking_time.end_date).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 py-2 items-center justify-center w-full">
            <a className="w-full" href={`tel:+${booking.student.phone}`}>
              <Button color="primary" variant="flat" className="py-6 w-full">
                <AiOutlinePhone />
                Liên hệ
              </Button>
            </a>
            <a
              className="w-full"
              target="_blank"
              href={`mailto:${booking.student.account.email}`}
            >
              <Button color="primary" className="py-6 w-full">
                <AiOutlineMail />
                Gửi mail
              </Button>
            </a>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
