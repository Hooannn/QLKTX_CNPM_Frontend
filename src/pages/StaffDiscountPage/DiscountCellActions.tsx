import { Button, useDisclosure } from "@nextui-org/react";
import { Discount } from "../../types";
import UpdateDiscountModal from "./UpdateDiscountModal";
import DeleteDiscountModal from "./DeleteDiscountModal";

export default function DiscountCellActions({
  discount,
}: {
  discount: Discount;
}) {
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
      <UpdateDiscountModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        discount={discount}
      />
      <DeleteDiscountModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        discount={discount}
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
