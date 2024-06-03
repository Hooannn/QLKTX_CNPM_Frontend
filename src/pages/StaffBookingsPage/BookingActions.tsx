import { Button, useDisclosure } from "@nextui-org/react";
import { Booking } from "../../types";
import CheckoutModal from "./CheckoutModal";
import CreateInvoiceModal from "./CreateInvoiceModal";
import DeleteBookingModal from "./DeleteBookingModal";

export default function BookingActions({
  booking,
  hadPaid,
  hadInvoice,
  onDeleted,
}: {
  booking?: Booking;
  hadPaid: boolean;
  hadInvoice: boolean;
  onDeleted: () => void;
}) {
  const {
    isOpen: isCheckoutModalOpen,
    onOpen: onCheckoutModalOpen,
    onClose: onCheckoutModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateInvoiceModalOpen,
    onOpen: onCreateInvoiceModalOpen,
    onClose: onCreateInvoiceModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteBookingModalOpen,
    onOpen: onDeleteBookingModalOpen,
    onClose: onDeleteBookingModalClose,
  } = useDisclosure();
  const isDisabled = booking?.checked_out_at !== null;
  return (
    <>
      <DeleteBookingModal
        onDeleted={onDeleted}
        isOpen={isDeleteBookingModalOpen}
        booking={booking}
        onClose={onDeleteBookingModalClose}
      />
      <CreateInvoiceModal
        isOpen={isCreateInvoiceModalOpen}
        booking={booking}
        onClose={onCreateInvoiceModalClose}
      />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        booking={booking}
        onClose={onCheckoutModalClose}
      />
      {/*<Button
        isDisabled={isDisabled || hadInvoice}
        color="primary"
        onClick={onCreateInvoiceModalOpen}
        variant="flat"
        className="py-6 w-full"
      >
        Tạo hoá đơn
      </Button>*/}
      <Button
        isDisabled={isDisabled}
        color="primary"
        className="py-6 w-full"
        onClick={onCheckoutModalOpen}
      >
        Trả phòng
      </Button>
      <Button
        onClick={onDeleteBookingModalOpen}
        isDisabled={isDisabled || hadPaid}
        color="danger"
        variant="flat"
        className="py-6 w-full"
      >
        Hủy đặt phòng
      </Button>
    </>
  );
}
