import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Booking, IResponseData, Region } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../libs/dayjs";
type CheckoutInputs = {
  checkout_at: string;
};

export default function CheckoutModal(props: {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInputs>();

  const onSubmit: SubmitHandler<CheckoutInputs> = async (data) => {
    await checkoutMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const checkoutMutation = useMutation({
    mutationFn: (params: CheckoutInputs) =>
      axios.post<IResponseData<Region>>(
        `/api/v1/booking/check-out/${props.booking?.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/detailBooking", props.booking?.id]);
      queryClient.invalidateQueries(["fetch/currentBookings"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Trả phòng
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn trả phòng cho sinh viên{" "}
                  <strong>{props.booking?.student.id}</strong>?
                </p>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    defaultValue={dayjs().format("YYYY-MM-DD")}
                    errorMessage={errors.checkout_at?.message}
                    {...register("checkout_at", {
                      required: "Ngày trả phòng không được để trống",
                    })}
                    placeholder="dd/mm/yyyy"
                    date-format="dd/mm/yyyy"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    variant="bordered"
                    size={"md"}
                    label="Ngày trả phòng"
                  />
                </div>
              </ModalBody>
              <ModalFooter className="pb-0">
                <Button
                  isLoading={checkoutMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={checkoutMutation.isLoading}
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
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
