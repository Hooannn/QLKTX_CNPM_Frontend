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
import { IResponseData, IUser } from "../../types";
import CreateStudentModal from "./CreateStaffModal";
import UserCellActions from "./StaffCellActions";
import { AiOutlineSearch } from "react-icons/ai";
import { useDebounce } from "@uidotdev/usehooks";
import { SEX_MAP, ROLE_MAP } from "../../utils/map";
export default function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getUsersQuery = useQuery({
    queryKey: ["fetch/staffs-management"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(`/api/v1/staffs`);
    },
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const shouldShowLookupUsers = debouncedSearchKeyword.trim().length > 0;

  const lookupUsersQuery = useQuery({
    queryKey: ["lookup/users/staffs-management", debouncedSearchKeyword],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (!shouldShowLookupUsers) return null;
      return axios.get<IResponseData<IUser[]>>(`/api/v1/staffs/lookup`, {
        params: {
          keyword: debouncedSearchKeyword,
        },
      });
    },
  });

  const lookupUsers = lookupUsersQuery.data?.data?.data ?? [];
  const users = getUsersQuery.data?.data?.data ?? [];

  const {
    isOpen: isCreateUserModalOpen,
    onOpen: onOpenCreateUserModal,
    onClose: onCreateUserModalClose,
  } = useDisclosure();

  const [selectedSex, setSelectedSex] = useState<string>("ALL");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  const filterUsers = () => {
    const shouldShowUsers = shouldShowLookupUsers ? lookupUsers : users;
    return shouldShowUsers
      .filter((user) => {
        if (selectedSex !== "ALL") return user.sex === selectedSex;
        return true;
      })
      .filter((user) => {
        if (selectedRole !== "ALL") return user.account.role === selectedRole;
        return true;
      });
  };

  const tableItems = filterUsers().slice((page - 1) * 10, page * 10);

  return (
    <>
      <CreateStudentModal
        isOpen={isCreateUserModalOpen}
        onClose={onCreateUserModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý nhân viên</div>
          <div className="flex gap-4">
            <div className="w-1/2">
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
            <Select
              disallowEmptySelection
              defaultSelectedKeys={["ALL"]}
              size="sm"
              color="primary"
              className="w-40"
              variant="bordered"
              label="Quyền"
              onSelectionChange={(selection) => {
                const keys = Array.from(selection) as string[];
                setSelectedRole(keys[0]?.toString());
              }}
            >
              <SelectItem key="ALL" value="ALL">
                Tất cả
              </SelectItem>
              <SelectItem key="STAFF" value="STAFF">
                Nhân viên
              </SelectItem>
              <SelectItem key="ADMIN" value="ADMIN">
                Quản lý
              </SelectItem>
            </Select>
            <Button
              onClick={onOpenCreateUserModal}
              color="primary"
              className="p-6"
            >
              Tạo mới
            </Button>
          </div>
        </div>

        <Table
          bottomContent={
            filterUsers().length > 10 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showShadow
                  color="primary"
                  page={page}
                  total={
                    filterUsers().length % 10 === 0
                      ? filterUsers().length / 10
                      : filterUsers().length / 10 + 1
                  }
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="id">Mã</TableColumn>
            <TableColumn key="first_name">Tên</TableColumn>
            <TableColumn key="last_name">Họ</TableColumn>
            <TableColumn key="email">Email</TableColumn>
            <TableColumn key="address">Địa chỉ</TableColumn>
            <TableColumn key="phone">Số ĐT</TableColumn>
            <TableColumn key="role">Quyền</TableColumn>
            <TableColumn key="sex">Giới tính</TableColumn>
            <TableColumn key="date_of_birth">Ngày sinh</TableColumn>
            <TableColumn key="actions">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            items={tableItems.map((item) => ({
              ...item,
              role: item.account.role,
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
                  <small>Hiện tại không có người dùng nào.</small>
                </div>
              </div>
            }
            loadingContent={<Spinner />}
            loadingState={getUsersQuery.isLoading ? "loading" : undefined}
          >
            {(item) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "actions" ? (
                      <UserCellActions user={item} />
                    ) : (
                      <>
                        {getKeyValue(item, columnKey) ? (
                          <>
                            {columnKey === "date_of_birth" &&
                              dayjs(getKeyValue(item, columnKey)).format(
                                "DD/MM/YYYY"
                              )}
                            {columnKey === "role" &&
                              ROLE_MAP[getKeyValue(item, columnKey)]}
                            {columnKey === "sex" &&
                              SEX_MAP[getKeyValue(item, columnKey)]}

                            {columnKey !== "date_of_birth" &&
                              columnKey !== "sex" &&
                              columnKey !== "role" &&
                              getKeyValue(item, columnKey)}
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
      </div>
    </>
  );
}
