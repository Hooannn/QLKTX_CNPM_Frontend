import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Invoice } from "../../types";
import InvoicesTable from "./InvoicesTable";
import { useState } from "react";
import dayjs from "../../libs/dayjs";
import toast from "react-hot-toast";
import {
  Popover,
  Badge,
  PopoverTrigger,
  Button,
  PopoverContent,
  Input,
} from "@nextui-org/react";
import { AiOutlineFilter } from "react-icons/ai";
export default function PaidTab({ studentId }: { studentId?: string }) {
  const axios = useAxiosIns();

  const getInvoicesQuery = useQuery({
    queryKey: ["fetch/paidInvoices", studentId],
    queryFn: () =>
      axios.get<IResponseData<Invoice[]>>(
        `${
          studentId
            ? `/api/v1/invoice/paid/student/${studentId}`
            : "/api/v1/invoice/paid"
        }`
      ),
    refetchOnWindowFocus: false,
  });

  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<Invoice[]>([]);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [paidFrom, setPaidFrom] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [shouldOpenFilter, setShouldOpenFilter] = useState(false);

  const invoices = getInvoicesQuery.data?.data?.data || [];

  const filterData = () => {
    if (isFiltering) return filteredData;
    return invoices;
  };

  const onFilter = () => {
    if (
      !createdFrom &&
      !createdTo &&
      !dueFrom &&
      !dueTo &&
      !paidFrom &&
      !paidTo
    ) {
      setIsFiltering(false);
      setShouldOpenFilter(false);
      setFilteredData([]);
      return;
    }
    if (
      dayjs(createdFrom).isAfter(dayjs(createdTo)) ||
      dayjs(createdFrom).isSame(dayjs(createdTo))
    ) {
      toast.error("'Ngày lập': 'Từ' phải trước 'Đến'");
      return;
    }
    if (
      dayjs(dueFrom).isAfter(dayjs(dueTo)) ||
      dayjs(dueFrom).isSame(dayjs(dueTo))
    ) {
      toast.error("'Hạn thanh toán': 'Từ' phải trước 'Đến'");
      return;
    }
    if (
      dayjs(paidFrom).isAfter(dayjs(paidTo)) ||
      dayjs(paidFrom).isSame(dayjs(paidTo))
    ) {
      toast.error("'Ngày thanh toán': 'Từ' phải trước 'Đến'");
      return;
    }
    setIsFiltering(true);
    setShouldOpenFilter(false);
    const filteredData = invoices.filter((item) => {
      let firstCondition = false;
      let secondCondition = false;
      let thirdCondition = false;
      if (createdFrom || createdTo) {
        if (createdFrom && !createdTo)
          firstCondition =
            dayjs(item.created_at).isAfter(dayjs(createdFrom)) ||
            dayjs(item.created_at).isSame(dayjs(createdFrom));
        else if (!createdFrom && createdTo)
          firstCondition =
            dayjs(item.created_at).isBefore(dayjs(createdTo)) ||
            dayjs(item.created_at).isSame(dayjs(createdTo));
        else
          firstCondition =
            (dayjs(item.created_at).isAfter(dayjs(createdFrom)) &&
              dayjs(item.created_at).isBefore(dayjs(createdTo))) ||
            dayjs(item.created_at).isSame(dayjs(createdFrom)) ||
            dayjs(item.created_at).isSame(dayjs(createdTo));
      } else firstCondition = true;
      if (dueFrom || dueTo) {
        if (dueFrom && !dueTo)
          secondCondition =
            dayjs(item.due_date).isAfter(dayjs(dueFrom)) ||
            dayjs(item.due_date).isSame(dayjs(dueFrom));
        else if (!dueFrom && dueTo)
          secondCondition =
            dayjs(item.due_date).isBefore(dayjs(dueTo)) ||
            dayjs(item.due_date).isSame(dayjs(dueTo));
        else
          secondCondition =
            (dayjs(item.due_date).isAfter(dayjs(dueFrom)) &&
              dayjs(item.due_date).isBefore(dayjs(dueTo))) ||
            dayjs(item.due_date).isSame(dayjs(dueFrom)) ||
            dayjs(item.due_date).isSame(dayjs(dueTo));
      } else secondCondition = true;
      if (paidFrom || paidTo) {
        if (paidFrom && !paidTo)
          thirdCondition =
            dayjs(item.paid_at).isAfter(dayjs(paidFrom)) ||
            dayjs(item.paid_at).isSame(dayjs(paidFrom));
        else if (!paidFrom && paidTo)
          thirdCondition =
            dayjs(item.paid_at).isBefore(dayjs(paidTo)) ||
            dayjs(item.paid_at).isSame(dayjs(paidTo));
        else
          thirdCondition =
            (dayjs(item.paid_at).isAfter(dayjs(paidFrom)) &&
              dayjs(item.paid_at).isBefore(dayjs(paidTo))) ||
            dayjs(item.paid_at).isSame(dayjs(paidFrom)) ||
            dayjs(item.paid_at).isSame(dayjs(paidTo));
      } else thirdCondition = true;

      return firstCondition && secondCondition && thirdCondition;
    });
    setFilteredData(filteredData);
  };

  const onReset = () => {
    setCreatedFrom("");
    setCreatedTo("");
    setDueFrom("");
    setDueTo("");
    setPaidFrom("");
    setPaidTo("");
  };
  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Hoá đơn đã thanh toán</div>
          <Popover
            placement="bottom"
            showArrow={true}
            isOpen={shouldOpenFilter}
            onOpenChange={(open) => setShouldOpenFilter(open)}
          >
            <Badge
              color="danger"
              shape="circle"
              content=""
              isInvisible={!isFiltering}
              showOutline={false}
            >
              <PopoverTrigger>
                <Button className="p-6 w-24" color="primary" variant="flat">
                  <AiOutlineFilter size={16} />
                  Lọc
                </Button>
              </PopoverTrigger>
            </Badge>
            <PopoverContent>
              <div className="w-80 p-1">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    radius="full"
                    variant="bordered"
                    className="p-4"
                    onClick={onReset}
                  >
                    Đặt lại
                  </Button>
                  <strong>Lọc</strong>
                  <Button
                    size="sm"
                    radius="full"
                    color="primary"
                    className="p-4"
                    onClick={onFilter}
                  >
                    Áp dụng
                  </Button>
                </div>
                <div className="flex flex-col py-2">
                  <div>Ngày lập</div>
                  <div className="flex gap-1 items-center justify-between">
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Từ"
                      value={createdFrom}
                      onChange={(e) => setCreatedFrom(e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Đến"
                      value={createdTo}
                      onChange={(e) => setCreatedTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <div>Hạn thanh toán</div>
                  <div className="flex gap-1 items-center justify-between">
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Từ"
                      value={dueFrom}
                      onChange={(e) => setDueFrom(e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Đến"
                      value={dueTo}
                      onChange={(e) => setDueTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <div>Ngày thanh toán</div>
                  <div className="flex gap-1 items-center justify-between">
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Từ"
                      value={paidFrom}
                      onChange={(e) => setPaidFrom(e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      type="date"
                      size={"sm"}
                      label="Đến"
                      value={paidTo}
                      onChange={(e) => setPaidTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <InvoicesTable
          onDeleted={() => {}}
          onUpdated={() => {}}
          updatable={false}
          invoices={filterData()}
          isLoading={getInvoicesQuery.isLoading}
        />
      </div>
    </>
  );
}
