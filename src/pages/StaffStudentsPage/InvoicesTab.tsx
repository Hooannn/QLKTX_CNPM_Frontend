import { IResponseData, IUser, Invoice } from "../../types";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import InvoicesTable from "../StaffInvoicesPage/InvoicesTable";
import { Spinner, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

export default function InvoicesTab({ student }: { student: IUser }) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const getInvoicesQuery = useQuery({
    queryKey: ["fetch/invoicesByStudent", student.id],
    queryFn: () =>
      axios.get<IResponseData<Invoice[]>>(
        `/api/v1/invoice/student/${student.id}`
      ),
    refetchOnWindowFocus: false,
  });

  const invoices = getInvoicesQuery.data?.data?.data || [];

  const [selectedState, setSelectedState] = useState<string>("ALL");

  const filteredInvoices = () =>
    invoices.filter((invoice) => {
      if (selectedState === "ALL") return true;
      else if (selectedState === "UNPAID") return !invoice.paid_at;
      else if (selectedState === "PAID") return invoice.paid_at !== null;
    });
  return (
    <>
      {getInvoicesQuery.isLoading ? (
        <div className="flex items-center flex-col py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="pb-4">
            <Select
              disallowEmptySelection
              onSelectionChange={(selection) => {
                const keys = Array.from(selection) as string[];
                setSelectedState(keys[0]?.toString());
              }}
              color="primary"
              className="w-40 h-12"
              size="sm"
              variant="bordered"
              defaultSelectedKeys={["ALL"]}
              label="Tình trạng"
            >
              <SelectItem key="ALL" value="ALL">
                Tất cả
              </SelectItem>
              <SelectItem key="UNPAID" value="UNPAID">
                Chưa thanh toán
              </SelectItem>
              <SelectItem key="PAID" value="PAID">
                Đã thanh toán
              </SelectItem>
            </Select>
          </div>
          <InvoicesTable
            updatable
            onDeleted={() => {
              queryClient.invalidateQueries([
                "fetch/invoicesByStudent",
                student.id,
              ]);
            }}
            onUpdated={() => {
              queryClient.invalidateQueries([
                "fetch/invoicesByStudent",
                student.id,
              ]);
            }}
            invoices={filteredInvoices()}
            isLoading={getInvoicesQuery.isLoading}
          />
        </>
      )}
    </>
  );
}
