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
  Image,
} from "@nextui-org/react";
import dayjs from "../../libs/dayjs";
import { Invoice } from "../../types";
import { useState } from "react";
import InvoiceCellActions from "./InvoiceCellActions";
import { priceFormat } from "../../utils/priceFormat";

export default function InvoicesTable({
  updatable,
  invoices,
  isLoading,
  onDeleted,
  onUpdated,
}: {
  updatable: boolean;
  invoices: Invoice[];
  isLoading: boolean;
  onDeleted: () => void;
  onUpdated: () => void;
}) {
  const [page, setPage] = useState(1);

  const filterInvoices = () => {
    return invoices;
  };

  const tableItems = filterInvoices().slice((page - 1) * 10, page * 10);
  return (
    <Table
      bottomContent={
        filterInvoices().length > 10 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showShadow
              color="primary"
              page={page}
              total={
                filterInvoices().length % 10 === 0
                  ? filterInvoices().length / 10
                  : filterInvoices().length / 10 + 1
              }
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      {updatable ? (
        <TableHeader>
          <TableColumn key="id">Mã hoá đơn</TableColumn>
          <TableColumn key="booking_id">Mã phiếu thuê</TableColumn>
          <TableColumn key="staff_id">Mã quản lý ghi nhận</TableColumn>
          <TableColumn key="total">Tổng tiền</TableColumn>
          <TableColumn key="created_at">Ngày lập</TableColumn>
          <TableColumn key="paid_at">Ngày thanh toán</TableColumn>
          <TableColumn key="actions">Thao tác</TableColumn>
        </TableHeader>
      ) : (
        <TableHeader>
          <TableColumn key="id">Mã hoá đơn</TableColumn>
          <TableColumn key="booking_id">Mã phiếu thuê</TableColumn>
          <TableColumn key="staff_id">Mã quản lý ghi nhận</TableColumn>
          <TableColumn key="total">Tổng tiền</TableColumn>
          <TableColumn key="created_at">Ngày lập</TableColumn>
          <TableColumn key="paid_at">Ngày thanh toán</TableColumn>
        </TableHeader>
      )}

      <TableBody
        items={tableItems.map((invoice) => ({
          ...invoice,
          booking_id: invoice.booking.id,
          staff_id: invoice.staff.id,
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
              <small>Hiện tại không có hoá đơn nào.</small>
            </div>
          </div>
        }
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : undefined}
      >
        {(item) => (
          <TableRow key={item?.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <InvoiceCellActions
                    onDeleted={onDeleted}
                    onUpdated={onUpdated}
                    invoice={item}
                  />
                ) : (
                  <>
                    {getKeyValue(item, columnKey) ? (
                      <>
                        {columnKey === "created_at" || columnKey === "paid_at"
                          ? dayjs(getKeyValue(item, columnKey)).format(
                              "DD/MM/YYYY"
                            )
                          : columnKey === "total"
                          ? priceFormat(getKeyValue(item, columnKey))
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
  );
}
