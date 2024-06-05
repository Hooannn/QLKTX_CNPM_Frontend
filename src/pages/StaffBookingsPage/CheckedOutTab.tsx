import { Booking } from "../../types/booking";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Room } from "../../types";
import BookingsTable from "./BookingsTable";
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
export default function CheckedOutTab({ room }: { room?: Room }) {
  const axios = useAxiosIns();

  const bookingsQuery = {
    queryKey: ["fetch/checkedOutBookings"],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>("/api/v1/booking/checked-out"),
    refetchOnWindowFocus: false,
  };

  const roomBookingsQuery = {
    queryKey: ["fetch/checkedOutBookings/roomId", room?.id],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>(
        `/api/v1/booking/room/${room?.id}/checked-out`
      ),
    refetchOnWindowFocus: false,
  };

  const getBookingsQuery = useQuery(room ? roomBookingsQuery : bookingsQuery);

  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");
  const [endFrom, setEndFrom] = useState("");
  const [endTo, setEndTo] = useState("");
  const [checkedOutFrom, setCheckedOutFrom] = useState("");
  const [checkedOutTo, setCheckedOutTo] = useState("");
  const [shouldOpenFilter, setShouldOpenFilter] = useState(false);

  const bookings = getBookingsQuery.data?.data?.data || [];

  const filterData = () => {
    if (isFiltering) return filteredData;
    return bookings;
  };

  const onFilter = () => {
    if (
      !createdFrom &&
      !createdTo &&
      !startFrom &&
      !startTo &&
      !endFrom &&
      !endTo &&
      !checkedOutFrom &&
      !checkedOutTo
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
      dayjs(startFrom).isAfter(dayjs(startTo)) ||
      dayjs(startFrom).isSame(dayjs(startTo))
    ) {
      toast.error("'Ngày bắt đầu': 'Từ' phải trước 'Đến'");
      return;
    }
    if (
      dayjs(endFrom).isAfter(dayjs(endTo)) ||
      dayjs(endFrom).isSame(dayjs(endTo))
    ) {
      toast.error("'Ngày kết thúc': 'Từ' phải trước 'Đến'");
      return;
    }
    if (
      dayjs(checkedOutFrom).isAfter(dayjs(checkedOutTo)) ||
      dayjs(checkedOutFrom).isSame(dayjs(checkedOutTo))
    ) {
      toast.error("'Ngày trả': 'Từ' phải trước 'Đến'");
      return;
    }
    setIsFiltering(true);
    setShouldOpenFilter(false);
    const filteredData = bookings.filter((item) => {
      let firstCondition = false;
      let secondCondition = false;
      let thirdCondition = false;
      let fourthCondition = false;
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
      if (startFrom || startTo) {
        if (startFrom && !startTo)
          secondCondition =
            dayjs(item.booking_time.start_date).isAfter(dayjs(startFrom)) ||
            dayjs(item.booking_time.start_date).isSame(dayjs(startFrom));
        else if (!startFrom && startTo)
          secondCondition =
            dayjs(item.booking_time.start_date).isBefore(dayjs(startTo)) ||
            dayjs(item.booking_time.start_date).isSame(dayjs(startTo));
        else
          secondCondition =
            (dayjs(item.booking_time.start_date).isAfter(dayjs(startFrom)) &&
              dayjs(item.booking_time.start_date).isBefore(dayjs(startTo))) ||
            dayjs(item.booking_time.start_date).isSame(dayjs(startFrom)) ||
            dayjs(item.booking_time.start_date).isSame(dayjs(startTo));
      } else secondCondition = true;
      if (endFrom || endTo) {
        if (endFrom && !endTo)
          thirdCondition =
            dayjs(item.booking_time.end_date).isAfter(dayjs(endFrom)) ||
            dayjs(item.booking_time.end_date).isSame(dayjs(endFrom));
        else if (!endFrom && endTo)
          thirdCondition =
            dayjs(item.booking_time.end_date).isBefore(dayjs(endTo)) ||
            dayjs(item.booking_time.end_date).isSame(dayjs(endTo));
        else
          thirdCondition =
            (dayjs(item.booking_time.end_date).isAfter(dayjs(endFrom)) &&
              dayjs(item.booking_time.end_date).isBefore(dayjs(endTo))) ||
            dayjs(item.booking_time.end_date).isSame(dayjs(endFrom)) ||
            dayjs(item.booking_time.end_date).isSame(dayjs(endTo));
      } else thirdCondition = true;
      if (checkedOutFrom || checkedOutTo) {
        if (checkedOutFrom && !checkedOutTo)
          fourthCondition =
            dayjs(item.checked_out_at).isAfter(dayjs(checkedOutFrom)) ||
            dayjs(item.checked_out_at).isSame(dayjs(checkedOutFrom));
        else if (!checkedOutFrom && checkedOutTo)
          fourthCondition =
            dayjs(item.checked_out_at).isBefore(dayjs(checkedOutTo)) ||
            dayjs(item.checked_out_at).isSame(dayjs(checkedOutTo));
        else
          fourthCondition =
            (dayjs(item.checked_out_at).isAfter(dayjs(checkedOutFrom)) &&
              dayjs(item.checked_out_at).isBefore(dayjs(checkedOutTo))) ||
            dayjs(item.checked_out_at).isSame(dayjs(checkedOutFrom)) ||
            dayjs(item.checked_out_at).isSame(dayjs(checkedOutTo));
      } else fourthCondition = true;

      return (
        firstCondition && secondCondition && thirdCondition && fourthCondition
      );
    });
    setFilteredData(filteredData);
  };

  const onReset = () => {
    setCreatedFrom("");
    setCreatedTo("");
    setStartFrom("");
    setStartTo("");
    setEndFrom("");
    setEndTo("");
    setCheckedOutFrom("");
    setCheckedOutTo("");
  };
  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Phiếu thuê đã trả</div>
          <div className="flex gap-2">
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
                  <Button className="p-6 w-32" color="primary" variant="flat">
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
                    <div>Ngày bắt đầu</div>
                    <div className="flex gap-1 items-center justify-between">
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Từ"
                        value={startFrom}
                        onChange={(e) => setStartFrom(e.target.value)}
                      />
                      <span>-</span>
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Đến"
                        value={startTo}
                        onChange={(e) => setStartTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <div>Ngày kết thúc</div>
                    <div className="flex gap-1 items-center justify-between">
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Từ"
                        value={endFrom}
                        onChange={(e) => setEndFrom(e.target.value)}
                      />
                      <span>-</span>
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Đến"
                        value={endTo}
                        onChange={(e) => setEndTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <div>Ngày trả</div>
                    <div className="flex gap-1 items-center justify-between">
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Từ"
                        value={checkedOutFrom}
                        onChange={(e) => setCheckedOutFrom(e.target.value)}
                      />
                      <span>-</span>
                      <Input
                        placeholder="dd/mm/yyyy"
                        date-format="dd/mm/yyyy"
                        type="date"
                        size={"sm"}
                        label="Đến"
                        value={checkedOutTo}
                        onChange={(e) => setCheckedOutTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <BookingsTable
          bookings={filterData()}
          isLoading={getBookingsQuery.isLoading}
        />
      </div>
    </>
  );
}
