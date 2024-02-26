import { Button, useDisclosure } from "@nextui-org/react";
import { Room } from "../../types";
import UpdateRoomModal from "./UpdateRoomModal";
import DeleteRoomModal from "./DeleteRoomModal";
import { AiOutlineDelete } from "react-icons/ai";

export default function RoomActions({
  room,
  onDeleted,
  onUpdated,
}: {
  room?: Room;
  onDeleted: () => void;
  onUpdated: () => void;
}) {
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  return (
    <>
      <UpdateRoomModal
        isOpen={isUpdateModalOpen}
        room={room}
        onUpdated={onUpdated}
        onClose={onUpdateModalClose}
      />
      <DeleteRoomModal
        onDeleted={onDeleted}
        isOpen={isDeleteModalOpen}
        room={room}
        onClose={onDeleteModalClose}
      />
      <Button
        onClick={onUpdateModalOpen}
        color="primary"
        variant="flat"
        className="py-6 w-full"
      >
        Cập nhật
      </Button>
      <Button
        onClick={onDeleteModalOpen}
        color="danger"
        className="py-6 w-full"
      >
        <AiOutlineDelete />
        Xoá phòng
      </Button>
    </>
  );
}
