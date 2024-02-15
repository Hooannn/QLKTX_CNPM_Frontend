import { AiOutlineClose } from "react-icons/ai";
import { Room } from "../../types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
export default function RoomDetailModal(props: {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}) {
  return (
    <>
      <Modal
        size="full"
        hideCloseButton
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-4">
                <Button size="lg" onClick={props.onClose} isIconOnly>
                  <AiOutlineClose />
                </Button>
                Thông tin chi tiết
              </ModalHeader>
              <ModalBody className="flex-row"></ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
