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
import { BookingRequest, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function CancelRequestModal(props: {
  isOpen: boolean;
  onClose: () => void;
  bookingRequest: BookingRequest;
  onCanceled?: () => void;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/booking/request/${props.bookingRequest.id}/cancel`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/bookingRequests"]);
      props.onCanceled?.();
    },
  });

  const confirm = async () => {
    await deleteMutation.mutateAsync();
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận huỷ yêu cầu
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc muốn huỷ yêu cầu này?</p>
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
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
