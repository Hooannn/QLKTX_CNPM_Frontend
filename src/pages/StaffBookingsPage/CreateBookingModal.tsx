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
import useAuthStore from "../../stores/auth";

type CreateInputs = {
  booking_time_id: number;
  checkin_staff_id: string;
  room_id: string;
  student_id: string;
  discount_id?: string;
};

export default function CreateBookingModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInputs>();

  const { user } = useAuthStore();

  const onSubmit: SubmitHandler<CreateInputs> = async (data) => {
    await createMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (params: CreateInputs) =>
      axios.post<IResponseData<Booking>>(`/api/v1/booking`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
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
                Tạo phiếu thuê mới
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    errorMessage={errors.checkin_staff_id?.message}
                    {...register("checkin_staff_id", {
                      required: "Mã quản lý nhận là bắt buộc",
                    })}
                    defaultValue={user?.id}
                    isDisabled
                    variant="bordered"
                    size={"md"}
                    label="Mã quản lý nhận"
                  />
                  <Input
                    errorMessage={errors.student_id?.message}
                    {...register("student_id", {
                      required: "Mã sinh viên là bắt buộc",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mã sinh viên"
                  />
                  <Input
                    errorMessage={errors.room_id?.message}
                    {...register("room_id", {
                      required: "Mã phòng là bắt buộc",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mã phòng"
                  />
                  <Input
                    errorMessage={errors.booking_time_id?.message}
                    {...register("booking_time_id", {
                      required: "Mã thời gian thuê là bắt buộc",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mã thời gian thuê"
                  />
                  <Input
                    errorMessage={errors.discount_id?.message}
                    {...register("discount_id", {
                      required: false,
                    })}
                    variant="bordered"
                    size={"md"}
                    type="password"
                    label="Mã giảm giá (nếu có)"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={createMutation.isLoading}
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
