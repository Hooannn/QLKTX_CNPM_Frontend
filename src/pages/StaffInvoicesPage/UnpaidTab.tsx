import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Invoice } from "../../types";
import InvoicesTable from "./InvoicesTable";

export default function UnpaidTab({ studentId }: { studentId?: string }) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const getInvoicesQuery = useQuery({
    queryKey: ["fetch/unpaidInvoices", studentId],
    queryFn: () =>
      axios.get<IResponseData<Invoice[]>>(
        `${
          studentId
            ? `/api/v1/invoice/unpaid/student/${studentId}`
            : "/api/v1/invoice/unpaid"
        }`
      ),
    refetchOnWindowFocus: false,
  });

  const invoices = getInvoicesQuery.data?.data?.data || [];
  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Hoá đơn cần thanh toán</div>
        </div>

        <InvoicesTable
          onDeleted={() => {
            queryClient.invalidateQueries(["fetch/unpaidInvoices"]);
          }}
          onUpdated={() => {
            queryClient.invalidateQueries(["fetch/unpaidInvoices"]);
          }}
          updatable={!studentId}
          invoices={invoices}
          isLoading={getInvoicesQuery.isLoading}
        />
      </div>
    </>
  );
}
