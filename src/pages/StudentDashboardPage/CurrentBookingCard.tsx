import {
  Card,
  CardBody,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Image,
  Avatar,
} from "@nextui-org/react";
import dayjs from "dayjs";

import { IoBedOutline } from "react-icons/io5";

import { Booking, IResponseData, IUser } from "../../types";
import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { priceFormat } from "../../utils/priceFormat";
import { SEX_MAP } from "../../utils/map";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../stores/auth";

export default function CurrentBookingCard({ booking }: { booking: Booking }) {
  const {
    isOpen: isDetailModalOpen,
    onOpen: onOpenDetailModal,
    onClose: onDetailModalClose,
  } = useDisclosure();

  return (
    <>
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
        booking={booking}
      />
      <Card isPressable onPress={onOpenDetailModal} radius="sm" shadow="sm">
        <CardBody>
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-primary-400 rounded-md text-white shadow-sm text-gray">
              <IoBedOutline size={24} />
            </div>
            <div className="text-center mt-2 w-[300px]">
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Mã phiếu thuê:</div>
                <div className="font-semibold">{booking.id}</div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Phòng:</div>
                <div className="font-semibold">{booking.room.id}</div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Quản lý:</div>
                <div className="font-semibold">
                  {booking.checkin_staff.first_name}{" "}
                  {booking.checkin_staff.last_name}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Ngày bắt đầu:</div>
                <div className="font-semibold">
                  {dayjs(booking.booking_time.start_date).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="text-sm flex items-center justify-between">
                <div className="opacity-70">Ngày kết thúc:</div>
                <div className="font-semibold">
                  {dayjs(booking.booking_time.end_date).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function DetailModal({
  booking,
  isOpen,
  onClose,
}: {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}) {
  const axios = useAxiosIns();
  const getCurrentBookingsByRoom = useQuery({
    queryKey: ["fetch/student/currentBookingsByRoom", booking.id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(
        `/api/v1/booking/room/${booking.room.id}`
      );
    },
  });

  const bookings = getCurrentBookingsByRoom.data?.data?.data || [];
  return (
    <>
      <Modal size="full" hideCloseButton isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-4">
                <Button size="lg" onClick={onClose} isIconOnly>
                  <AiOutlineClose />
                </Button>
                Thông tin chi tiết
              </ModalHeader>
              <ModalBody className="flex-row">
                <div className="h-full flex flex-col justify-between items-center w-[500px] border-r-1 border-gray pr-5">
                  <div className="w-full flex flex-col gap-3 items-center">
                    <div className="w-full">
                      <div>Thông tin phiếu thuê</div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã phiếu thuê</div>{" "}
                          <div>{booking?.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Ngày lập</div>{" "}
                          <div>
                            {dayjs(booking?.created_at).format("DD/MM/YYYY")}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Thời gian bắt đầu</div>{" "}
                          <div>
                            {dayjs(booking?.booking_time.start_date).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Thời gian kết thúc</div>{" "}
                          <div>
                            {dayjs(booking?.booking_time.end_date).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Ngày trả</div>{" "}
                          <div>
                            {booking?.checked_out_at ? (
                              dayjs(booking?.checked_out_at).format(
                                "DD/MM/YYYY"
                              )
                            ) : (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div>Thông tin giảm giá</div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã giảm giá</div>{" "}
                          <div>
                            {booking?.discount?.id ?? (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mô tả</div>{" "}
                          <div>
                            {booking?.discount?.description ?? (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Phần trăm giảm</div>{" "}
                          <div>
                            {booking?.discount?.percentage ? (
                              `${booking.discount.percentage}%`
                            ) : (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div>Thông tin phòng</div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã phòng</div>{" "}
                          <div>{booking?.room.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Tên loại phòng</div>{" "}
                          <div>{booking?.room.type.name}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Đơn giá phòng</div>{" "}
                          <div>
                            {priceFormat(booking?.room.type.price ?? 0)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Số giường</div>{" "}
                          <div>{booking?.room.type.capacity}</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div>Thông tin quản lý nhận</div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã quản lý</div>{" "}
                          <div>{booking?.checkin_staff.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Tên</div>{" "}
                          <div>
                            {booking?.checkin_staff.first_name}{" "}
                            {booking?.checkin_staff.last_name}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Giới tính</div>{" "}
                          <div>
                            {SEX_MAP[booking?.checkin_staff.sex ?? "OTHER"]}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div>Thông tin quản lý trả</div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã quản lý</div>{" "}
                          <div>
                            {booking?.checkout_staff?.id ?? (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Tên</div>{" "}
                          <div>
                            {booking?.checkout_staff ? (
                              `${booking?.checkout_staff.first_name} ${booking?.checkout_staff.last_name}`
                            ) : (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Giới tính</div>{" "}
                          <div>
                            {booking?.checkout_staff?.sex ? (
                              SEX_MAP[booking?.checkout_staff?.sex ?? "OTHER"]
                            ) : (
                              <small>Chưa cập nhật</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full flex flex-col gap-4">
                  <div>
                    <small>Lưu trú hiện tại</small>
                  </div>
                  <div>
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
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { user } = useAuthStore();
  return (
    <>
      <Card radius="sm" shadow="sm">
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
                <div className="font-semibold">
                  {booking.student.account.email}
                </div>
              </div>
            </div>
          </div>
          {user?.id !== booking.student.id && (
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
          )}
        </CardBody>
      </Card>
    </>
  );
}
