import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IResponseData, Room } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function DeleteRoomModal(props: {
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
  onDeleted: () => void;
}) {
  const axios = useAxiosIns();

  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(`/api/v1/rooms/${props.room?.id}`),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
    },
  });

  const confirm = async () => {
    await deleteMutation.mutateAsync();
    props.onDeleted();
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận xoá phòng
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc muốn xoá phòng này?</p>
                <p className="text-red-500">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị mất.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Huỷ
                </Button>
                <Button
                  isLoading={deleteMutation.isLoading}
                  color="danger"
                  onPress={confirm}
                >
                  Xoá
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
