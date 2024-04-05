import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Booking, IResponseData } from "../../types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { onError } from "../../utils/error-handlers";

export default function DeleteBookingModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  booking?: Booking;
}) {
  const onSubmit = async () => {
    await deleteMutation.mutateAsync();
    props.onClose();
  };
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/booking/${props.booking?.id}`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/currentBookings"]);
      props.onDeleted();
    },
  });
  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Huỷ đặt phòng
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn huỷ đặt phòng cho sinh viên{" "}
                  <strong>{props.booking?.student.id}</strong>?
                </p>
              </ModalBody>
              <ModalFooter className="pb-0">
                <Button
                  isLoading={deleteMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={deleteMutation.isLoading}
                  color="danger"
                  onClick={onSubmit}
                >
                  Xác nhận
                </Button>
              </ModalFooter>
              <div className="text-right px-6 pb-3">
                <small className="text-gray-500">
                  * Bạn không thể sửa thông tin sau khi xác nhận
                </small>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
