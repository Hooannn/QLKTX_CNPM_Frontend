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
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, IUser } from "../../types";
import CreateUserModal from "./CreateUserModal";

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
  return (
    <>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={onCreateUserModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý người dùng</div>
          <Button
            onClick={onOpenCreateUserModal}
            color="primary"
            className="p-6"
          >
            Tạo mới
          </Button>
        </div>

        <Table
          bottomContent={
            users.length > 10 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={
                    users.length % 10 === 0
                      ? users.length / 10
                      : users.length / 10 + 1
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
            items={users.slice((page - 1) * 10, page * 10)}
            loadingContent={<Spinner />}
            loadingState={
              getUsersQuery.isLoading
                ? "loading"
                : getUsersQuery.isError
                ? "error"
                : undefined
            }
          >
            {(item) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "actions" ? (
                      <div className="flex gap-1">
                        <Button size="sm" color="primary" variant="light">
                          Sửa
                        </Button>
                        <Button size="sm" color="danger" variant="flat">
                          Xóa
                        </Button>
                      </div>
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
