import { Button, useDisclosure } from "@nextui-org/react";
import { RoomType } from "../../types";
import DeleteRoomTypeModal from "./DeleteRoomTypeModal";
import UpdateRoomTypeModal from "./UpdateRoomTypeModal";

export default function RoomTypeCellActions({
  roomType,
}: {
  roomType: RoomType;
}) {
  const {
    isOpen: isDeleteRoomTypeModalOpen,
    onOpen: onOpenDeleteRoomTypeModal,
    onClose: onDeleteRoomTypeModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateRoomTypeModalOpen,
    onOpen: onOpenUpdateRoomTypeModal,
    onClose: onUpdateRoomTypeModalClose,
  } = useDisclosure();

  return (
    <>
      <UpdateRoomTypeModal
        isOpen={isUpdateRoomTypeModalOpen}
        onClose={onUpdateRoomTypeModalClose}
        roomType={roomType}
      />
      <DeleteRoomTypeModal
        isOpen={isDeleteRoomTypeModalOpen}
        onClose={onDeleteRoomTypeModalClose}
        roomType={roomType}
      />
      <div className="flex gap-1">
        <Button
          onClick={onOpenUpdateRoomTypeModal}
          size="sm"
          color="primary"
          variant="light"
        >
          Sửa
        </Button>
        <Button
          onClick={onOpenDeleteRoomTypeModal}
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
