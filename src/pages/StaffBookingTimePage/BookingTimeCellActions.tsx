import { Button, useDisclosure } from "@nextui-org/react";
import { BookingTime } from "../../types";
import DeleteBookingTimeModal from "./DeleteBookingTimeModal";
import UpdateBookingTimeModal from "./UpdateBookingTimeModal";

export default function BookingTimeCellActions({ bookingTime }: { bookingTime: BookingTime }) {
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onOpenDeleteModal,
        onClose: onDeleteModalClose,
    } = useDisclosure();
    const {
        isOpen: isUpdateModalOpen,
        onOpen: onOpenUpdateModal,
        onClose: onUpdateModalClose,
    } = useDisclosure();

    return (
        <>
            <UpdateBookingTimeModal
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                bookingTime={bookingTime}
            />
            <DeleteBookingTimeModal
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                bookingTime={bookingTime}
            />
            <div className="flex gap-1">
                <Button
                    onClick={onOpenUpdateModal}
                    size="sm"
                    color="primary"
                    variant="light"
                >
                    Sửa
                </Button>
                <Button
                    onClick={onOpenDeleteModal}
                    size="sm"
                    color="danger"
                    variant="flat"
                >
                    Xóa
                </Button>
            </div>
        </>
    );
}
