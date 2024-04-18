import {
  Button,
  Image,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { AiOutlineSearch } from "react-icons/ai";
import { ROLE_MAP } from "../../utils/map";
import AccountCellActions from "./AccountCellActions";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { Account, IResponseData } from "../../types";
import { useDebounce } from "@uidotdev/usehooks";
import CreateAccountModal from "./CreateAccountModal";

export default function AccountsManagementPage() {
  const [page, setPage] = useState(1);
  const axios = useAxiosIns();
  const getAccountsQuery = useQuery({
    queryKey: ["fetch/accounts-management"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Account[]>>(`/api/v1/accounts`);
    },
  });

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  const shouldShowLookupAccounts = debouncedSearchKeyword.trim().length > 0;

  const lookupAccountsQuery = useQuery({
    queryKey: ["lookup/accounts", debouncedSearchKeyword],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (!shouldShowLookupAccounts) return null;
      return axios.get<IResponseData<Account[]>>(`/api/v1/accounts/lookup`, {
        params: {
          keyword: debouncedSearchKeyword,
        },
      });
    },
  });

  const lookupAccounts = lookupAccountsQuery.data?.data?.data ?? [];
  const accounts = getAccountsQuery.data?.data?.data ?? [];

  const {
    isOpen: isCreateAccountModalOpen,
    onOpen: onOpenCreateAccountModal,
    onClose: onCreateAccountModalClose,
  } = useDisclosure();

  const filterAccounts = () => {
    const shouldShowAccounts = shouldShowLookupAccounts
      ? lookupAccounts
      : accounts;
    return shouldShowAccounts;
  };

  const tableItems = filterAccounts().slice((page - 1) * 10, page * 10);
  return (
    <>
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={onCreateAccountModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Quản lý tài khoản</div>
          <div className="flex gap-4 justify-end">
            <div className="w-[300px]">
              <Input
                value={searchKeyword}
                onValueChange={(value) => setSearchKeyword(value)}
                color="primary"
                variant="bordered"
                label="Tìm kiếm bằng mã tài khoản hoặc email"
                isClearable
                size="sm"
                className="h-12 w-full"
                placeholder="Nhập từ khóa..."
                startContent={
                  <AiOutlineSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Button
              onClick={onOpenCreateAccountModal}
              color="primary"
              className="p-6"
            >
              Tạo mới
            </Button>
          </div>
        </div>

        <Table
          bottomContent={
            filterAccounts().length > 10 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showShadow
                  color="primary"
                  page={page}
                  total={
                    filterAccounts().length % 10 === 0
                      ? filterAccounts().length / 10
                      : filterAccounts().length / 10 + 1
                  }
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="username">Tên đăng nhập</TableColumn>
            <TableColumn key="email">Email</TableColumn>
            <TableColumn key="role">Vai trò</TableColumn>
            <TableColumn key="actions">Thao tác</TableColumn>
          </TableHeader>
          <TableBody
            items={tableItems.map((item) => ({
              ...item,
              role: item.role.role,
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
            loadingState={getAccountsQuery.isLoading ? "loading" : undefined}
          >
            {(item) => (
              <TableRow key={item?.username}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "actions" ? (
                      <AccountCellActions account={item} />
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

                            {columnKey !== "role" &&
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
