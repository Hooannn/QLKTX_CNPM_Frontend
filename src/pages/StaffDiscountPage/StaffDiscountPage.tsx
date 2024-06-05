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
  Badge,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Discount } from "../../types";
import CreateDiscountModal from "./CreateDiscountModal";
import DiscountCellActions from "./DiscountCellActions";
import { AiOutlineFilter } from "react-icons/ai";
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

  const [isFiltering, setIsFiltering] = useState(false);
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");
  const [endFrom, setEndFrom] = useState("");
  const [endTo, setEndTo] = useState("");
  const [shouldOpenFilter, setShouldOpenFilter] = useState(false);
  const [filteredData, setFilteredData] = useState<Discount[]>([]);

  const filterData = () => {
    if (isFiltering) return filteredData;
    return data;
  };

  const tableItems = filterData().slice((page - 1) * 10, page * 10);

  const onFilter = () => {
    if (!startFrom && !startTo && !endFrom && !endTo) {
      setIsFiltering(false);
      setShouldOpenFilter(false);
      setFilteredData([]);
      return;
    }
    if (
      dayjs(startFrom).isAfter(dayjs(startTo)) ||
      dayjs(startFrom).isSame(dayjs(startTo))
    ) {
      toast.error("'Ngày bắt đầu': 'Từ' phải trước 'Đến'");
      return;
    }
    if (
      dayjs(endFrom).isAfter(dayjs(endTo)) ||
      dayjs(endFrom).isSame(dayjs(endTo))
    ) {
      toast.error("'Ngày kết thúc': 'Từ' phải trước 'Đến'");
      return;
    }
    setIsFiltering(true);
    setShouldOpenFilter(false);
    const filteredData = data.filter((item) => {
      let firstCondition = false;
      let secondCondition = false;
      if (startFrom || startTo) {
        if (startFrom && !startTo)
          firstCondition =
            dayjs(item.start_date).isAfter(dayjs(startFrom)) ||
            dayjs(item.start_date).isSame(dayjs(startFrom));
        else if (!startFrom && startTo)
          firstCondition =
            dayjs(item.start_date).isBefore(dayjs(startTo)) ||
            dayjs(item.start_date).isSame(dayjs(startTo));
        else
          firstCondition =
            (dayjs(item.start_date).isAfter(dayjs(startFrom)) &&
              dayjs(item.start_date).isBefore(dayjs(startTo))) ||
            dayjs(item.start_date).isSame(dayjs(startFrom)) ||
            dayjs(item.start_date).isSame(dayjs(startTo));
      } else firstCondition = true;
      if (endFrom || endTo) {
        if (endFrom && !endTo)
          secondCondition =
            dayjs(item.end_date).isAfter(dayjs(endFrom)) ||
            dayjs(item.end_date).isSame(dayjs(endFrom));
        else if (!endFrom && endTo)
          secondCondition =
            dayjs(item.end_date).isBefore(dayjs(endTo)) ||
            dayjs(item.end_date).isSame(dayjs(endTo));
        else
          secondCondition =
            (dayjs(item.end_date).isAfter(dayjs(endFrom)) &&
              dayjs(item.end_date).isBefore(dayjs(endTo))) ||
            dayjs(item.end_date).isSame(dayjs(endFrom)) ||
            dayjs(item.end_date).isSame(dayjs(endTo));
      } else secondCondition = true;

      return firstCondition && secondCondition;
    });
    setFilteredData(filteredData);
  };

  const onReset = () => {
    setStartFrom("");
    setStartTo("");
    setEndFrom("");
    setEndTo("");
  };

  return (
    <>
      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý giảm giá</div>
          <div className="flex gap-2">
            <Popover
              placement="bottom"
              showArrow={true}
              isOpen={shouldOpenFilter}
              onOpenChange={(open) => setShouldOpenFilter(open)}
            >
              <Badge
                color="danger"
                shape="circle"
                content=""
                isInvisible={!isFiltering}
                showOutline={false}
              >
                <PopoverTrigger>
                  <Button className="p-6 w-24" color="primary" variant="flat">
                    <AiOutlineFilter size={16} />
                    Lọc
                  </Button>
                </PopoverTrigger>
              </Badge>
              <PopoverContent>
                <div className="w-80 p-1">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      radius="full"
                      variant="bordered"
                      className="p-4"
                      onClick={onReset}
                    >
                      Đặt lại
                    </Button>
                    <strong>Lọc</strong>
                    <Button
                      size="sm"
                      radius="full"
                      color="primary"
                      className="p-4"
                      onClick={onFilter}
                    >
                      Áp dụng
                    </Button>
                  </div>
                  <div className="flex flex-col py-2">
                    <div>Ngày bắt đầu</div>
                    <div className="flex gap-1 items-center justify-between">
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Từ"
                        value={startFrom}
                        onChange={(e) => setStartFrom(e.target.value)}
                      />
                      <span>-</span>
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Đến"
                        value={startTo}
                        onChange={(e) => setStartTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <div>Ngày kết thúc</div>
                    <div className="flex gap-1 items-center justify-between">
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Từ"
                        value={endFrom}
                        onChange={(e) => setEndFrom(e.target.value)}
                      />
                      <span>-</span>
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Đến"
                        value={endTo}
                        onChange={(e) => setEndTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={onOpenCreateModal}
              color="primary"
              className="p-6 w-24"
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
