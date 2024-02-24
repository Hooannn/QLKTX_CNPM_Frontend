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
  Image,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Discount } from "../../types";
import CreateDiscountModal from "./CreateDiscountModal";
import DiscountCellActions from "./DiscountCellActions";
export default function StaffDiscountPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getQuery = useQuery({
    queryKey: ["fetch/discount"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Discount[]>>(`/api/v1/discount`);
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
      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý giảm giá</div>
          <div className="flex gap-4">
            <Button onClick={onOpenCreateModal} color="primary" className="p-6">
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
            <TableColumn key="percentage">Phần trăm giảm</TableColumn>
            <TableColumn key="staff_id">Mã người quản lý tạo</TableColumn>
            <TableColumn key="actions">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            items={tableItems.map((item) => ({
              ...item,
              staff_id: item.staff.id,
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
                  <small>Hiện tại không có mã giảm giá nào.</small>
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
                      <DiscountCellActions discount={item} />
                    ) : (
                      <>
                        {typeof getKeyValue(item, columnKey) === "boolean" ? (
                          getKeyValue(item, columnKey) ? (
                            "Có"
                          ) : (
                            "Không"
                          )
                        ) : (
                          <>
                            {getKeyValue(item, columnKey) ? (
                              <>
                                {columnKey === "start_date" ||
                                columnKey === "end_date"
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
