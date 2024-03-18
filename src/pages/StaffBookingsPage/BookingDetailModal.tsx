import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { Booking, IResponseData, Invoice } from "../../types";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SEX_MAP } from "../../utils/map";
import { priceFormat } from "../../utils/priceFormat";
import dayjs from "../../libs/dayjs";
import InvoicesTable from "../StaffInvoicesPage/InvoicesTable";
import { useState } from "react";
import BookingActions from "./BookingActions";
export default function BookingDetailModal(props: {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const getDetailQuery = useQuery({
    queryKey: ["fetch/detailBooking", props.booking.id],
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
    queryFn: () =>
      axios.get<IResponseData<Booking>>(`/api/v1/booking/${props.booking.id}`),
  });

  const getInvoicesQuery = useQuery({
    queryKey: ["fetch/invoicesByBooking", props.booking.id],
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
    queryFn: () =>
      axios.get<IResponseData<Invoice[]>>(
        `/api/v1/invoice/booking/${props.booking.id}`
      ),
  });

  const bookingDetail = getDetailQuery.data?.data?.data;
  const invoices = getInvoicesQuery.data?.data?.data || [];
  const [selectedState, setSelectedState] = useState<string>("ALL");

  const filteredInvoices = () =>
    invoices.filter((invoice) => {
      if (selectedState === "ALL") return true;
      else if (selectedState === "UNPAID") return !invoice.paid_at;
      else if (selectedState === "PAID") return invoice.paid_at !== null;
    });
  return (
    <>
      <Modal
        size="full"
        hideCloseButton
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-4">
                <Button size="lg" onClick={props.onClose} isIconOnly>
                  <AiOutlineClose />
                </Button>
                Thông tin chi tiết
              </ModalHeader>
              {getDetailQuery.isLoading ? (
                <>
                  <ModalBody className="flex-row">
                    <div className="w-full flex items-center justify-center">
                      <Spinner size="lg" />
                    </div>
                  </ModalBody>
                </>
              ) : (
                <>
                  <ModalBody className="flex-row">
                    <div className="h-full flex flex-col justify-between items-center w-[500px] border-r-1 border-gray pr-5">
                      <div className="w-full flex flex-col gap-3 items-center">
                        <div className="w-full">
                          <div>Thông tin phiếu thuê</div>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Mã phiếu thuê</div>{" "}
                              <div>{bookingDetail?.id}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Ngày lập</div>{" "}
                              <div>
                                {dayjs(bookingDetail?.created_at).format(
                                  "DD/MM/YYYY"
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">
                                Thời gian bắt đầu
                              </div>{" "}
                              <div>
                                {dayjs(
                                  bookingDetail?.booking_time.start_date
                                ).format("DD/MM/YYYY")}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">
                                Thời gian kết thúc
                              </div>{" "}
                              <div>
                                {dayjs(
                                  bookingDetail?.booking_time.end_date
                                ).format("DD/MM/YYYY")}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Ngày trả</div>{" "}
                              <div>
                                {bookingDetail?.checked_out_at ? (
                                  dayjs(bookingDetail?.checked_out_at).format(
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
                                {bookingDetail?.discount?.id ?? (
                                  <small>Chưa cập nhật</small>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Mô tả</div>{" "}
                              <div>
                                {bookingDetail?.discount?.description ?? (
                                  <small>Chưa cập nhật</small>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Phần trăm giảm</div>{" "}
                              <div>
                                {bookingDetail?.discount?.percentage ? (
                                  `${bookingDetail.discount.percentage}%`
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
                              <div>{bookingDetail?.room.id}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Tên loại phòng</div>{" "}
                              <div>{bookingDetail?.room.type.name}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Đơn giá phòng</div>{" "}
                              <div>
                                {priceFormat(
                                  bookingDetail?.room.type.price ?? 0
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Số giường</div>{" "}
                              <div>{bookingDetail?.room.type.capacity}</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div>Thông tin quản lý nhận</div>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Mã quản lý</div>{" "}
                              <div>{bookingDetail?.checkin_staff.id}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Tên</div>{" "}
                              <div>
                                {bookingDetail?.checkin_staff.first_name}{" "}
                                {bookingDetail?.checkin_staff.last_name}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Giới tính</div>{" "}
                              <div>
                                {
                                  SEX_MAP[
                                    bookingDetail?.checkin_staff.sex ?? "OTHER"
                                  ]
                                }
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
                                {bookingDetail?.checkout_staff?.id ?? (
                                  <small>Chưa cập nhật</small>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Tên</div>{" "}
                              <div>
                                {bookingDetail?.checkout_staff ? (
                                  `${bookingDetail?.checkout_staff.first_name} ${bookingDetail?.checkout_staff.last_name}`
                                ) : (
                                  <small>Chưa cập nhật</small>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Giới tính</div>{" "}
                              <div>
                                {bookingDetail?.checkout_staff?.sex ? (
                                  SEX_MAP[
                                    bookingDetail?.checkout_staff?.sex ??
                                      "OTHER"
                                  ]
                                ) : (
                                  <small>Chưa cập nhật</small>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center flex-col justify-center w-full py-4">
                        <BookingActions
                          hadInvoice={invoices.length > 0}
                          booking={bookingDetail}
                        />
                      </div>
                    </div>
                    <div className="h-full flex flex-col items-center gap-3 w-[500px] border-r-1 border-gray pr-5">
                      <div>Sinh viên thuê</div>
                      <Avatar
                        size="lg"
                        className="w-32 h-32"
                        fallback={<AiOutlineUser size={40} />}
                      ></Avatar>
                      <div className="font-semibold text-xl">
                        {bookingDetail?.student.first_name}{" "}
                        {bookingDetail?.student.last_name}
                      </div>
                      <div className="flex gap-2 items-center justify-center w-full">
                        <a
                          className="w-full"
                          href={`tel:+${bookingDetail?.student.phone}`}
                        >
                          <Button
                            color="primary"
                            variant="flat"
                            className="py-6 w-full"
                          >
                            <AiOutlinePhone />
                            Liên hệ
                          </Button>
                        </a>
                        <a
                          className="w-full"
                          target="_blank"
                          href={`mailto:${bookingDetail?.student.email}`}
                        >
                          <Button color="primary" className="py-6 w-full">
                            <AiOutlineMail />
                            Gửi mail
                          </Button>
                        </a>
                      </div>
                      <div className="flex flex-col w-full gap-1">
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Mã sinh viên</div>{" "}
                          <div>{bookingDetail?.student.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Email</div>{" "}
                          <div>{bookingDetail?.student.email}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Địa chỉ</div>{" "}
                          <div>
                            {bookingDetail?.student.address ?? (
                              <>
                                <small>Chưa cập nhật</small>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">Ngày sinh</div>{" "}
                          <div>
                            {bookingDetail?.student.date_of_birth ? (
                              dayjs(
                                bookingDetail?.student.date_of_birth
                              ).format("DD/MM/YYYY")
                            ) : (
                              <>
                                <small>Chưa cập nhật</small>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="opacity-70">SĐT</div>{" "}
                          <div>
                            {bookingDetail?.student.phone ?? (
                              <>
                                <small>Chưa cập nhật</small>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 h-full flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>Hóa đơn</div>
                        <Select
                          disallowEmptySelection
                          onSelectionChange={(selection) => {
                            const keys = Array.from(selection) as string[];
                            setSelectedState(keys[0]?.toString());
                          }}
                          color="primary"
                          className="w-40 h-12"
                          size="sm"
                          variant="bordered"
                          defaultSelectedKeys={["ALL"]}
                          label="Tình trạng"
                        >
                          <SelectItem key="ALL" value="ALL">
                            Tất cả
                          </SelectItem>
                          <SelectItem key="UNPAID" value="UNPAID">
                            Chưa thanh toán
                          </SelectItem>
                          <SelectItem key="PAID" value="PAID">
                            Đã thanh toán
                          </SelectItem>
                        </Select>
                      </div>

                      <InvoicesTable
                        updatable
                        onDeleted={() => {
                          queryClient.invalidateQueries([
                            "fetch/invoicesByBooking",
                            props.booking.id,
                          ]);
                        }}
                        onUpdated={() => {
                          queryClient.invalidateQueries([
                            "fetch/invoicesByBooking",
                            props.booking.id,
                          ]);
                        }}
                        invoices={filteredInvoices()}
                        isLoading={getInvoicesQuery.isLoading}
                      />
                    </div>
                  </ModalBody>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
