import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Booking, IResponseData } from "../../types";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, useDisclosure } from "@nextui-org/react";
import BookingsTable from "./BookingsTable";
import BookingRequestModal from "../../components/shared/BookingRequestModal";

export default function CurrentTab() {
  const axios = useAxiosIns();

  const getBookingsQuery = useQuery({
    queryKey: ["fetch/currentBookings"],
    queryFn: () => axios.get<IResponseData<Booking[]>>("/api/v1/booking"),
    refetchOnWindowFocus: false,
  });

  const bookings = getBookingsQuery.data?.data?.data || [];

  const {
    isOpen: isCreateModalOpen,
    onOpen: onOpenCreateModal,
    onClose: onCreateModalClose,
  } = useDisclosure();
  return (
    <>
      <BookingRequestModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Phiếu thuê hiện tại</div>
          <div className="flex gap-4">
            <Button onClick={onOpenCreateModal} color="primary" className="p-6">
              <AiOutlinePlus /> Tạo mới
            </Button>
          </div>
        </div>

        <BookingsTable
          bookings={bookings}
          isLoading={getBookingsQuery.isLoading}
        />
      </div>
    </>
  );
}
