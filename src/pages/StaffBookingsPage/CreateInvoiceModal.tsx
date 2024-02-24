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
import { Booking, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
type CreateInputs = {
  total: number;
};

export default function CreateInvoiceModal(props: {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInputs>();

  const onSubmit: SubmitHandler<CreateInputs> = async (data) => {
    await checkoutMutation.mutateAsync({
      total: data.total,
      booking_id: props.booking?.id as number,
    });
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const checkoutMutation = useMutation({
    mutationFn: (params: { total: number; booking_id: number }) =>
      axios.post<IResponseData<unknown>>(`/api/v1/invoice`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries([
        "fetch/invoicesByBooking",
        props.booking?.id,
      ]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo hóa đơn
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    errorMessage={errors.total?.message}
                    {...register("total", {
                      required: "Tổng tiền là bắt buộc",
                      min: {
                        value: 1000,
                        message: "Tổng tiền phải lớn hơn 1000",
                      },
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Tổng tiền"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
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
                  Tạo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
