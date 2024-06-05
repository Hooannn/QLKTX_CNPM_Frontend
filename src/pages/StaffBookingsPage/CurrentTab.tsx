import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Booking, IResponseData } from "../../types";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import BookingsTable from "./BookingsTable";
import BookingRequestModal from "../../components/shared/BookingRequestModal";
import { useEffect, useState } from "react";
import dayjs from '../../libs/dayjs'
export default function CurrentTab() {
  const axios = useAxiosIns();

  const getBookingsQuery = useQuery({
    queryKey: ["fetch/currentBookings"],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>("/api/v1/booking/current"),
    refetchOnWindowFocus: false,
  });

  const bookings = getBookingsQuery.data?.data?.data || [];

  const {
    isOpen: isCreateModalOpen,
    onOpen: onOpenCreateModal,
    onClose: onCreateModalClose,
  } = useDisclosure();

  const [selectedField, setSelectField] = useState('none');
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [resetKey, setResetKey] = useState(Date.now())
  const [errMessage, setErrorMessage] = useState("")
  const [shouldShowDate, setShouldShowDate] = useState(false)
  useEffect(() => {
    if (selectedField === 'none') {
      setResetKey(Date.now())
      setStartTime(null)
      setEndTime(null)
      setShouldShowDate(false)
    } else {
      setShouldShowDate(true)
    }
  }, [selectedField])

  useEffect(() => {
    if (!startTime || !endTime) {
      setErrorMessage("")
      return;
    }
    if (dayjs(startTime).isAfter(endTime) || dayjs(startTime).isSame(endTime)) {
      setErrorMessage("Ngày bắt đầu phải trước ngày kết thúc")
    } else {
      setErrorMessage("")
    }
  }, [startTime, endTime])

  return (
    <>
      <BookingRequestModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Phiếu thuê hiện tại</div>
          <div className="flex flex-col items-center">
            <div className="flex gap-4 items-center">
              <Select
                value={selectedField}
                defaultSelectedKeys={['none']}
                disallowEmptySelection
                onSelectionChange={(key) => {
                  const keyArray = Array.from(key);
                  const k = keyArray[0];
                  setSelectField(k.toString());
                }}
                size="sm"
                className="w-60"
              >
                <SelectItem
                  key={'none'}
                  value={'none'}
                >
                  Tất cả
                </SelectItem>
                <SelectItem
                  key={'created_at'}
                  value={'created_at'}
                >
                  Ngày lập
                </SelectItem>
                <SelectItem
                  key={'start_date'}
                  value={'start_date'}
                >
                  Ngày bắt đầu
                </SelectItem>
                <SelectItem
                  key={'end_date'}
                  value={'end_date'}
                >
                  Ngày kết thúc
                </SelectItem>
                <SelectItem
                  key={'checked_out_at'}
                  value={'checked_out_at'}
                >
                  Ngày trả
                </SelectItem>
              </Select>
              <Input
                key={resetKey}
                disabled={!shouldShowDate}
                className="w-60"
                placeholder="dd/mm/yyyy"
                date-format="dd/mm/yyyy"
                type="date"
                variant="bordered"
                size={"md"}
                label="Ngày bắt đầu"
                value={startTime}
                onValueChange={(value) => setStartTime(value)}
              />
              <Input
                key={resetKey + 'ab'}
                disabled={!shouldShowDate}
                className="w-60"
                placeholder="dd/mm/yyyy"
                date-format="dd/mm/yyyy"
                type="date"
                variant="bordered"
                size={"md"}
                label="Ngày kết thúc"
                value={endTime}
                onValueChange={(value) => setEndTime(value)}

              />
              <Button onClick={onOpenCreateModal} color="primary" className="p-6">
                <AiOutlinePlus /> Tạo mới
              </Button>
            </div>
            {errMessage && <div className="text-red-500 text-sm">{errMessage}</div>}
          </div>
        </div>

        <BookingsTable
          startTime={startTime}
          endTime={endTime}
          bookings={bookings}
          isLoading={getBookingsQuery.isLoading}
        />
      </div>
    </>
  );
}
