import { Account } from "../../types";
import { useDisclosure, Button } from "@nextui-org/react";
import UpdateAccountModal from "./UpdateAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";

export default function AccountCellActions({ account }: { account: Account }) {
  const {
    isOpen: isDeleteAccountModalOpen,
    onOpen: onOpenDeleteAccountModal,
    onClose: onDeleteAccountModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateAccountModalOpen,
    onOpen: onOpenUpdateAccountModal,
    onClose: onUpdateAccountModalClose,
  } = useDisclosure();

  return (
    <>
      <UpdateAccountModal
        isOpen={isUpdateAccountModalOpen}
        onClose={onUpdateAccountModalClose}
        account={account}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={onDeleteAccountModalClose}
        account={account}
      />
      <div className="flex gap-1">
        <Button
          onClick={onOpenUpdateAccountModal}
          size="sm"
          color="primary"
          variant="light"
        >
          Sửa
        </Button>
        <Button
          onClick={onOpenDeleteAccountModal}
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
