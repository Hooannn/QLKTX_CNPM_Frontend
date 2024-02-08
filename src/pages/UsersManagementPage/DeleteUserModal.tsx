import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IUser, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function DeleteUserModal(props: {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(`/api/v1/users/${props.user.id}`),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/users"]);
    },
  });

  const confirm = async () => {
    await deleteUserMutation.mutateAsync();
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận xoá người dùng
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc muốn xoá người dùng này?</p>
                <p className="text-red-500">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị mất.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteUserMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Huỷ
                </Button>
                <Button
                  isLoading={deleteUserMutation.isLoading}
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
