import {
  Table,
  Pagination,
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  getKeyValue,
  Image,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { Booking } from "../../types";
import { useState } from "react";
import BookingCellActions from "./BookingCellActions";

export default function BookingsTable({
  bookings,
  isLoading,
  hideActions = false,
}: {
  bookings: Booking[];
  isLoading: boolean;
  hideActions?: boolean;
}) {
  const [page, setPage] = useState(1);

  const filterBookings = () => {
    return bookings;
  };

  const tableItems = filterBookings().slice((page - 1) * 10, page * 10);
  return (
    <Table
      bottomContent={
        filterBookings().length > 10 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showShadow
              color="primary"
              page={page}
              total={
                filterBookings().length % 10 === 0
                  ? filterBookings().length / 10
                  : filterBookings().length / 10 + 1
              }
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      {hideActions ? (
        <TableHeader>
          <TableColumn key="id">Mã</TableColumn>
          <TableColumn key="room_id">Phòng</TableColumn>
          <TableColumn key="student_id">Mã sinh viên</TableColumn>
          <TableColumn key="created_at">Ngày lập</TableColumn>
          <TableColumn key="booking_time_start_date">Ngày bắt đầu</TableColumn>
          <TableColumn key="booking_time_end_date">Ngày kết thúc</TableColumn>
          <TableColumn key="checkin_staff_id">Mã quản lý nhận</TableColumn>
          <TableColumn key="checkout_staff_id">Mã quản lý trả</TableColumn>
          <TableColumn key="checked_out_at">Ngày trả</TableColumn>
          <TableColumn key="discount_id">Mã giảm giá</TableColumn>
        </TableHeader>
      ) : (
        <TableHeader>
          <TableColumn key="id">Mã</TableColumn>
          <TableColumn key="room_id">Phòng</TableColumn>
          <TableColumn key="student_id">Mã sinh viên</TableColumn>
          <TableColumn key="created_at">Ngày lập</TableColumn>
          <TableColumn key="booking_time_start_date">Ngày bắt đầu</TableColumn>
          <TableColumn key="booking_time_end_date">Ngày kết thúc</TableColumn>
          <TableColumn key="checkin_staff_id">Mã quản lý nhận</TableColumn>
          <TableColumn key="checkout_staff_id">Mã quản lý trả</TableColumn>
          <TableColumn key="checked_out_at">Ngày trả</TableColumn>
          <TableColumn key="discount_id">Mã giảm giá</TableColumn>
          <TableColumn key="actions">Thao tác</TableColumn>
        </TableHeader>
      )}

      <TableBody
        items={tableItems.map((booking) => ({
          ...booking,
          room_id: booking.room.id,
          student_id: booking.student.id,
          checkin_staff_id: booking.checkin_staff.id,
          checkout_staff_id: booking.checkout_staff?.id,
          discount_id: booking.discount?.id,
          booking_time_start_date: dayjs(
            booking.booking_time.start_date
          ).format("DD/MM/YYYY"),
          booking_time_end_date: dayjs(booking.booking_time.end_date).format(
            "DD/MM/YYYY"
          ),
        }))}
        emptyContent={
          <div>
            <Image
              removeWrapper
              className="mx-auto"
              width={250}
              src="/Empty.svg"
            />
            <div>
              <small>Hiện tại không có phiếu thuê nào.</small>
            </div>
          </div>
        }
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : undefined}
      >
        {(item) => (
          <TableRow key={item?.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <BookingCellActions booking={item} />
                ) : (
                  <>
                    {getKeyValue(item, columnKey) ? (
                      <>
                        {columnKey === "checked_out_at" ||
                        columnKey === "created_at"
                          ? dayjs(getKeyValue(item, columnKey)).format(
                              "DD/MM/YYYY"
                            )
                          : getKeyValue(item, columnKey)}
                      </>
                    ) : (
                      <i>
                        <small>Chưa cập nhật</small>
                      </i>
                    )}
                  </>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
