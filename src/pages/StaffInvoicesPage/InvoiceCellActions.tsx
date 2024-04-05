import { useDisclosure, Button } from "@nextui-org/react";
import { Invoice } from "../../types";
import UpdateInvoiceModal from "./UpdateInvoiceModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";

export default function InvoiceCellActions({
  invoice,
  onDeleted,
  onUpdated,
}: {
  invoice: Invoice;
  onDeleted: () => void;
  onUpdated: () => void;
}) {
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onOpenUpdateModal,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  return (
    <>
      <UpdateInvoiceModal
        onUpdated={onUpdated}
        invoice={invoice}
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
      />
      <DeleteInvoiceModal
        onDeleted={onDeleted}
        invoice={invoice}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
      <div className="flex items-center">
        <Button
          size="sm"
          onClick={onOpenUpdateModal}
          color="primary"
          variant="light"
          isDisabled={invoice.paid_at !== null}
        >
          Sửa
        </Button>
        {/*
          {invoice.paid_at === null && (
          <Button
            size="sm"
            onClick={onOpenDeleteModal}
            color="danger"
            variant="flat"
            isDisabled={invoice.paid_at !== null}
          >
            Xoá
          </Button>
        )}
        */}
      </div>
    </>
  );
}
