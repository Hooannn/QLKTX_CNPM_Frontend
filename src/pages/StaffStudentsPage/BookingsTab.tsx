import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { Booking, IResponseData, IUser } from "../../types";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import BookingsTable from "../StaffBookingsPage/BookingsTable";
import { useState } from "react";

export default function BookingsTab({ student }: { student: IUser }) {
  const axios = useAxiosIns();

  const getBookingsQuery = useQuery({
    queryKey: ["fetch/bookingsByStudent", student.id],
    queryFn: () =>
      axios.get<IResponseData<Booking[]>>(
        `/api/v1/booking/student/${student.id}`
      ),
    refetchOnWindowFocus: false,
  });

  const bookings = getBookingsQuery.data?.data?.data || [];

  const [selectedState, setSelectedState] = useState<string>("ALL");

  const filteredBookings = () =>
    bookings.filter((booking) => {
      if (selectedState === "ALL") return true;
      else if (selectedState === "CURRENT") return !booking.checked_out_at;
      else if (selectedState === "CHECKEDOUT")
        return booking.checked_out_at !== null;
    });

  return (
    <>
      {getBookingsQuery.isLoading ? (
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
              <SelectItem key="CURRENT" value="CURRENT">
                Hiện tại
              </SelectItem>
              <SelectItem key="CHECKEDOUT" value="CHECKEDOUT">
                Đã trả
              </SelectItem>
            </Select>
          </div>
          <BookingsTable
            bookings={filteredBookings()}
            isLoading={getBookingsQuery.isLoading}
          />
        </>
      )}
    </>
  );
}
