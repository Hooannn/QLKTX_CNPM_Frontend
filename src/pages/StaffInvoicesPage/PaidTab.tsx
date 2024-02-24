import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Invoice } from "../../types";
import InvoicesTable from "./InvoicesTable";

export default function PaidTab() {
  const axios = useAxiosIns();

  const getInvoicesQuery = useQuery({
    queryKey: ["fetch/paidInvoices"],
    queryFn: () => axios.get<IResponseData<Invoice[]>>("/api/v1/invoice/paid"),
    refetchOnWindowFocus: false,
  });

  const invoices = getInvoicesQuery.data?.data?.data || [];
  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Hoá đơn đã thanh toán</div>
        </div>

        <InvoicesTable
          onDeleted={() => {}}
          onUpdated={() => {}}
          updatable={false}
          invoices={invoices}
          isLoading={getInvoicesQuery.isLoading}
        />
      </div>
    </>
  );
}
