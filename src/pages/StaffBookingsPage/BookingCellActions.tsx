import { useDisclosure, Button } from "@nextui-org/react";
import { Booking } from "../../types";
import BookingDetailModal from "./BookingDetailModal";

export default function BookingCellActions({ booking }: { booking: Booking }) {
  const {
    isOpen: isDetailModalOpen,
    onOpen: onOpenDetailModal,
    onClose: onDetailModalClose,
  } = useDisclosure();
  return (
    <>
      <BookingDetailModal
        booking={booking}
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
      />
      <div className="flex items-center">
        <Button
          size="sm"
          onClick={onOpenDetailModal}
          color="primary"
          variant="light"
        >
          Xem chi tiết
        </Button>
      </div>
    </>
  );
}
