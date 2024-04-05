import { Image } from "@nextui-org/image";
import useAuthStore from "../../stores/auth";
import { BookingRequest, IResponseData, Role } from "../../types";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useState } from "react";
import dayjs from "../../libs/dayjs";
import BookingRequestCellActions from "./BookingRequestCellActions";

export default function BookingRequestTab({
  studentId,
}: {
  studentId?: string;
}) {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();
  const isStaff =
    user?.account.role.role === Role.STAFF ||
    user?.account.role.role === Role.ADMIN;

  const axios = useAxiosIns();

  const getBookingRequestsQuery = useQuery({
    queryKey: ["fetch/bookingRequests"],
    queryFn: () => {
      if (studentId) {
        if (isStaff)
          return axios.get<IResponseData<BookingRequest[]>>(
            `/api/v1/booking/request/user/${studentId}`
          );
        return axios.get<IResponseData<BookingRequest[]>>(
          "/api/v1/booking/request/own"
        );
      }
      return axios.get<IResponseData<BookingRequest[]>>(
        "/api/v1/booking/request"
      );
    },
    refetchOnWindowFocus: false,
  });

  const bookingRequests = getBookingRequestsQuery.data?.data?.data || [];

  const [selectedStatus, setSelectedStatus] = useState<string>("WAITING");

  const filterData = () => {
    return bookingRequests.filter((r) => {
      if (selectedStatus !== "ALL") return r.status === selectedStatus;
      return true;
    });
  };

  const tableItems = filterData().slice((page - 1) * 10, page * 10);

  return (
    <>
      {getBookingRequestsQuery.isLoading ? (
        <div className="flex items-center flex-col py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {bookingRequests.length > 0 ? (
            <div>
              <div className="flex items-center justify-between pb-4">
                <div className="text-lg font-bold">Yêu cầu thuê</div>
                <div className="flex gap-4">
                  <Select
                    disallowEmptySelection
                    onSelectionChange={(selection) => {
                      const keys = Array.from(selection) as string[];
                      setSelectedStatus(keys[0]?.toString());
                    }}
                    color="primary"
                    className="w-40 h-12"
                    size="sm"
                    variant="bordered"
                    selectedKeys={[selectedStatus]}
                    label="Trạng thái"
                  >
                    <SelectItem key="ALL" value="ALL">
                      Tất cả
                    </SelectItem>
                    <SelectItem key="WAITING" value="WAITING">
                      Chờ duyệt
                    </SelectItem>
                    <SelectItem key="ACCEPTED" value="ACCEPTED">
                      Đã duyệt
                    </SelectItem>
                    <SelectItem key="REJECTED" value="REJECTED">
                      Đã từ chối
                    </SelectItem>
                    <SelectItem key="CANCELED" value="CANCELED">
                      Đã huỷ
                    </SelectItem>
                  </Select>
                </div>
              </div>

              <Table
                bottomContent={
                  filterData().length > 10 ? (
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showShadow
                        color="primary"
                        page={page}
                        total={
                          filterData().length % 10 === 0
                            ? filterData().length / 10
                            : filterData().length / 10 + 1
                        }
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn key="id">Mã</TableColumn>
                  <TableColumn key="booking_time_des">
                    Thời gian thuê
                  </TableColumn>
                  <TableColumn key="booking_time_start">
                    Ngày bắt đầu
                  </TableColumn>
                  <TableColumn key="booking_time_end">
                    Ngày kết thúc
                  </TableColumn>
                  <TableColumn key="room_id">Phòng thuê</TableColumn>
                  <TableColumn key="student_id">Sinh viên thuê</TableColumn>
                  <TableColumn key="processed_at">Ngày xử lý</TableColumn>
                  <TableColumn key="reject_reason">Lý do từ chối</TableColumn>
                  <TableColumn key="staff_id">Người xử lý</TableColumn>
                  <TableColumn key="status">Trạng thái</TableColumn>
                  <TableColumn key="actions">Thao tác</TableColumn>
                </TableHeader>
                <TableBody
                  items={tableItems.map((item) => ({
                    ...item,
                    booking_time_des: item.booking_time.description,
                    booking_time_start: dayjs(
                      item.booking_time.start_date
                    ).format("DD/MM/YYYY"),
                    booking_time_end: dayjs(item.booking_time.end_date).format(
                      "DD/MM/YYYY"
                    ),
                    student_id: item.student.id,
                    staff_id: item.staff?.id,
                    room_id: item.room.id,
                    start_date: item.booking_time.start_date,
                    end_date: item.booking_time.end_date,
                  }))}
                  emptyContent={
                    <div>
                      <Image
                        removeWrapper
                        className="mx-auto"
                        width={250}
                        src="/Empty_Post.svg"
                      />
                      <div>
                        <small>Hiện tại không có yêu cầu nào</small>
                      </div>
                    </div>
                  }
                  loadingContent={<Spinner />}
                  loadingState={
                    getBookingRequestsQuery.isLoading ? "loading" : undefined
                  }
                >
                  {(item) => (
                    <TableRow key={item?.id}>
                      {(columnKey) => (
                        <TableCell>
                          <>
                            {columnKey === "actions" ? (
                              <BookingRequestCellActions
                                bookingRequest={item}
                              />
                            ) : (
                              <>
                                {getKeyValue(item, columnKey) ? (
                                  <>
                                    {columnKey === "processed_at"
                                      ? dayjs(
                                          getKeyValue(item, columnKey)
                                        ).format("DD/MM/YYYY")
                                      : getKeyValue(item, columnKey)}
                                  </>
                                ) : (
                                  <i>
                                    <small>Chưa cập nhật</small>
                                  </i>
                                )}
                              </>
                            )}
                          </>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center flex-col py-20">
              <Image width={200} src="/Empty_Post.svg" />
              <small>Hiện tại không có yêu cầu nào</small>
            </div>
          )}
        </>
      )}
    </>
  );
}
