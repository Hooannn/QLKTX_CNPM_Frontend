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
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, RoomType } from "../../types";
import CreateRoomTypeModal from "./CreateRoomTypeModal";
import RoomTypeCellActions from "./RoomTypeCellActions";
import { AiOutlineSearch } from "react-icons/ai";
import { useDebounce } from "@uidotdev/usehooks";
import { priceFormat } from "../../utils/priceFormat";
export default function StaffRoomTypesPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getRoomTypesQuery = useQuery({
    queryKey: ["fetch/room-types"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<RoomType[]>>(`/api/v1/room-types`);
    },
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const shouldShowLookupRoomTypes = debouncedSearchKeyword.trim().length > 0;

  const lookupRoomTypesQuery = useQuery({
    queryKey: ["lookup/room-types", debouncedSearchKeyword],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (!shouldShowLookupRoomTypes) return null;
      return axios.get<IResponseData<RoomType[]>>(`/api/v1/room-types/lookup`, {
        params: {
          keyword: debouncedSearchKeyword,
        },
      });
    },
  });

  const lookupRoomTypes = lookupRoomTypesQuery.data?.data?.data ?? [];
  const roomTypes = getRoomTypesQuery.data?.data?.data ?? [];

  const {
    isOpen: isCreateRoomTypeModalOpen,
    onOpen: onOpenCreateRoomTypeModal,
    onClose: onCreateRoomTypeModalClose,
  } = useDisclosure();

  const [selectedSex, setSelectedSex] = useState<string>("ALL");

  const filterRoomTypes = () => {
    const shouldShowRoomTypes = shouldShowLookupRoomTypes
      ? lookupRoomTypes
      : roomTypes;
    return shouldShowRoomTypes.filter((user) => {
      if (selectedSex !== "ALL") return user.sex === selectedSex;
      return true;
    });
  };

  const tableItems = filterRoomTypes().slice((page - 1) * 10, page * 10);

  return (
    <>
      <CreateRoomTypeModal
        isOpen={isCreateRoomTypeModalOpen}
        onClose={onCreateRoomTypeModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý loại phòng</div>
          <div className="flex gap-4">
            <div className="w-52">
              <Input
                value={searchKeyword}
                onValueChange={(value) => setSearchKeyword(value)}
                color="primary"
                variant="bordered"
                label="Tìm kiếm bằng mã hoặc tên"
                isClearable
                size="sm"
                className="h-12 w-full"
                placeholder="Nhập từ khóa..."
                startContent={
                  <AiOutlineSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Select
              disallowEmptySelection
              onSelectionChange={(selection) => {
                const keys = Array.from(selection) as string[];
                setSelectedSex(keys[0]?.toString());
              }}
              color="primary"
              className="w-40 h-12"
              size="sm"
              variant="bordered"
              defaultSelectedKeys={["ALL"]}
              label="Giới tính"
            >
              <SelectItem key="ALL" value="ALL">
                Tất cả
              </SelectItem>
              <SelectItem key="MALE" value="MALE">
                Nam
              </SelectItem>
              <SelectItem key="FEMALE" value="FEMALE">
                Nữ
              </SelectItem>
              <SelectItem key="OTHER" value="OTHER">
                Khác
              </SelectItem>
            </Select>
            <Button
              onClick={onOpenCreateRoomTypeModal}
              color="primary"
              className="p-6"
            >
              Tạo mới
            </Button>
          </div>
        </div>

        <Table
          bottomContent={
            filterRoomTypes().length > 10 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showShadow
                  color="primary"
                  page={page}
                  total={
                    filterRoomTypes().length % 10 === 0
                      ? filterRoomTypes().length / 10
                      : filterRoomTypes().length / 10 + 1
                  }
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="id">Mã</TableColumn>
            <TableColumn key="name">Tên</TableColumn>
            <TableColumn key="capacity">Sức chứa</TableColumn>
            <TableColumn key="price">Đơn giá</TableColumn>
            <TableColumn key="sex">Giới tính</TableColumn>
            <TableColumn key="actions">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            items={tableItems}
            emptyContent={
              <div>
                <Image
                  removeWrapper
                  className="mx-auto"
                  width={250}
                  src="/Empty.svg"
                />
                <div>
                  <small>Hiện tại không có loại phòng nào.</small>
                </div>
              </div>
            }
            loadingContent={<Spinner />}
            loadingState={getRoomTypesQuery.isLoading ? "loading" : undefined}
          >
            {(item) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "price" &&
                      priceFormat(getKeyValue(item, columnKey))}
                    {columnKey === "actions" ? (
                      <RoomTypeCellActions roomType={item} />
                    ) : (
                      <>
                        {columnKey !== "price" && (
                          <>
                            {getKeyValue(item, columnKey) ? (
                              <>
                                {columnKey === "date_of_birth"
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
