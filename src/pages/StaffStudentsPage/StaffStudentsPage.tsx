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
import { AiOutlineSearch } from "react-icons/ai";
import { useDebounce } from "@uidotdev/usehooks";
import StudentCellActions from "./StudentCellActions";
export default function StaffStudentsPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getUsersQuery = useQuery({
    queryKey: ["fetch/users/student"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(`/api/v1/users/student`);
    },
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const shouldShowLookupUsers = debouncedSearchKeyword.trim().length > 0;

  const lookupUsersQuery = useQuery({
    queryKey: ["lookup/users/student", debouncedSearchKeyword],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (!shouldShowLookupUsers) return null;
      return axios.get<IResponseData<IUser[]>>(`/api/v1/users/student/lookup`, {
        params: {
          keyword: debouncedSearchKeyword,
        },
      });
    },
  });

  const lookupUsers = lookupUsersQuery.data?.data?.data ?? [];
  const users = getUsersQuery.data?.data?.data ?? [];

  const [selectedSex, setSelectedSex] = useState<string>("ALL");

  const filterUsers = () => {
    const shouldShowUsers = shouldShowLookupUsers ? lookupUsers : users;
    return shouldShowUsers
      .filter((user) => {
        if (selectedSex !== "ALL") return user.sex === selectedSex;
        return true;
      })
  };

  const tableItems = filterUsers().slice((page - 1) * 10, page * 10);

  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Tra cứu sinh viên</div>
          <div className="flex gap-4">
            <div className="w-60">
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
                      <StudentCellActions user={item} />
                    ) : (
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
