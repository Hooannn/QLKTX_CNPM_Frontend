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
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, IUser } from "../../types";
import CreateUserModal from "./CreateUserModal";
import UserCellActions from "./UserCellActions";

export default function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getUsersQuery = useQuery({
    queryKey: ["fetch/users"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(`/api/v1/users`);
    },
  });

  const users = getUsersQuery.data?.data?.data ?? [];

  const {
    isOpen: isCreateUserModalOpen,
    onOpen: onOpenCreateUserModal,
    onClose: onCreateUserModalClose,
  } = useDisclosure();

  const [selectedSex, setSelectedSex] = useState<string>("ALL");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  const filterUsers = users
    .filter((user) => {
      if (selectedSex !== "ALL") return user.sex === selectedSex;
      return true;
    })
    .filter((user) => {
      if (selectedRole !== "ALL") return user.role === selectedRole;
      return true;
    });

  const tableItems = filterUsers.slice((page - 1) * 10, page * 10);

  return (
    <>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={onCreateUserModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý người dùng</div>
          <div className="flex gap-4">
            <Select
              onSelectionChange={(selection) => {
                const keys = Array.from(selection) as string[];
                setSelectedSex(keys[0]?.toString());
              }}
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
              defaultSelectedKeys={["ALL"]}
              size="sm"
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
              <SelectItem key="STUDENT" value="STUDENT">
                Sinh viên
              </SelectItem>
              <SelectItem key="STAFF" value="STAFF">
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
            filterUsers.length > 10 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showShadow
                  color="primary"
                  page={page}
                  total={
                    filterUsers.length % 10 === 0
                      ? filterUsers.length / 10
                      : filterUsers.length / 10 + 1
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
                        {getKeyValue(item, columnKey) ?? (
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
