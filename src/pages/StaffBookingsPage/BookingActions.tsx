import { Button, useDisclosure } from "@nextui-org/react";
import { Booking } from "../../types";
import CheckoutModal from "./CheckoutModal";
import CreateInvoiceModal from "./CreateInvoiceModal";

export default function BookingActions({ booking }: { booking?: Booking }) {
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
  const isDisabled = booking?.checked_out_at !== null;
  return (
    <>
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
      <Button
        isDisabled={isDisabled}
        color="primary"
        onClick={onCreateInvoiceModalOpen}
        variant="flat"
        className="py-6 w-full"
      >
        Tạo hoá đơn
      </Button>
      <Button
        isDisabled={isDisabled}
        color="primary"
        variant="flat"
        className="py-6 w-full"
      >
        Cập nhật
      </Button>
      <Button
        isDisabled={isDisabled}
        color="primary"
        className="py-6 w-full"
        onClick={onCheckoutModalOpen}
      >
        Trả phòng
      </Button>
    </>
  );
}
