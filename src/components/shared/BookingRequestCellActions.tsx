import { BookingRequest } from "../../types";
import BookingRequestDetailModal from "./BookingRequestDetailModal";
import { Button, useDisclosure } from "@nextui-org/react";

export default function BookingRequestCellActions({
  bookingRequest,
}: {
  bookingRequest: BookingRequest;
}) {
  const {
    isOpen: isDetailModalOpen,
    onOpen: onOpenDetailModal,
    onClose: onDetailModalClose,
  } = useDisclosure();

  return (
    <>
      <BookingRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
        bookingRequest={bookingRequest}
      />
      <div className="flex gap-1">
        <Button
          onClick={onOpenDetailModal}
          size="sm"
          color="primary"
          variant="light"
        >
          Chi tiết
        </Button>
      </div>
    </>
  );
}
