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
    Button,
    useDisclosure,
    Image
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, BookingTime } from "../../types";
import CreateBookingTimeModal from "./CreateBookingTimeModal";
import BookingTimeCellActions from "./BookingTimeCellActions";
export default function StaffBookingTimePage() {
    const [page, setPage] = useState(1);
    const axios = useAxiosIns();
    const getQuery = useQuery({
        queryKey: ["fetch/booking-time"],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get<IResponseData<BookingTime[]>>(`/api/v1/booking/booking-time`);
        },
    });

    const data = getQuery.data?.data?.data ?? [];

    const {
        isOpen: isCreateModalOpen,
        onOpen: onOpenCreateModal,
        onClose: onCreateModalClose,
    } = useDisclosure();

    const filterData = () => {
        return data;
    };

    const tableItems = filterData().slice((page - 1) * 10, page * 10);

    return (
        <>
            <CreateBookingTimeModal
                isOpen={isCreateModalOpen}
                onClose={onCreateModalClose}
            />
            <div>
                <div className="flex items-center justify-between pb-4">
                    <div className="text-lg font-bold">Quản lý thời gian thuê</div>
                    <div className="flex gap-4">
                        <Button
                            onClick={onOpenCreateModal}
                            color="primary"
                            className="p-6"
                        >
                            Tạo mới
                        </Button>
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
                        <TableColumn key="description">Mô tả</TableColumn>
                        <TableColumn key="start_date">Ngày bắt đầu</TableColumn>
                        <TableColumn key="end_date">Ngày kết thúc</TableColumn>
                        <TableColumn key="open">Đang mở</TableColumn>
                        <TableColumn key="staff_id">Mã người quản lý tạo</TableColumn>
                        <TableColumn key="actions">Thao tác</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={tableItems.map((item) => ({ ...item, staff_id: item.staff.id }))}
                        emptyContent={
                            <div>
                                <Image
                                    removeWrapper
                                    className="mx-auto"
                                    width={250}
                                    src="/Empty.svg"
                                />
                                <div>
                                    <small>Hiện tại không có thời gian thuê nào.</small>
                                </div>
                            </div>
                        }
                        loadingContent={<Spinner />}
                        loadingState={getQuery.isLoading ? "loading" : undefined}
                    >
                        {(item) => (
                            <TableRow key={item?.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === "actions" ? (
                                            <BookingTimeCellActions bookingTime={item} />
                                        ) : (
                                            <>
                                                {
                                                    typeof getKeyValue(item, columnKey) === "boolean" ? (getKeyValue(item, columnKey) ? 'Có' : "Không") : <>{getKeyValue(item, columnKey) ? (
                                                        <>
                                                            {columnKey === "start_date" || columnKey === "end_date"
                                                                ? dayjs(getKeyValue(item, columnKey)).format(
                                                                    "DD/MM/YYYY"
                                                                )
                                                                : getKeyValue(item, columnKey)}
                                                        </>
                                                    ) : (
                                                        <i>
                                                            <small>Chưa cập nhật</small>
                                                        </i>
                                                    )}</>
                                                }
                                            </>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
