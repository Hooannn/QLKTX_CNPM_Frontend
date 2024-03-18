import { Button, useDisclosure } from "@nextui-org/react";
import { IUser } from "../../types";
import DeleteUserModal from "./DeleteStaffModal";
import UpdateUserModal from "./UpdateStaffModal";

export default function UserCellActions({ user }: { user: IUser }) {
  const {
    isOpen: isDeleteUserModalOpen,
    onOpen: onOpenDeleteUserModal,
    onClose: onDeleteUserModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateUserModalOpen,
    onOpen: onOpenUpdateUserModal,
    onClose: onUpdateUserModalClose,
  } = useDisclosure();

  return (
    <>
      <UpdateUserModal
        isOpen={isUpdateUserModalOpen}
        onClose={onUpdateUserModalClose}
        user={user}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={onDeleteUserModalClose}
        user={user}
      />
      <div className="flex gap-1">
        <Button
          onClick={onOpenUpdateUserModal}
          size="sm"
          color="primary"
          variant="light"
        >
          Sửa
        </Button>
        <Button
          onClick={onOpenDeleteUserModal}
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
