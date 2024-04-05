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
import { Discount, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
type CreateInputs = {
  start_date: string;
  end_date: string;
  description: string;
  id: string;
  percentage: number;
};

export default function CreateDiscountModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInputs>();

  const onSubmit: SubmitHandler<CreateInputs> = async (data) => {
    await createMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (params: CreateInputs) =>
      axios.post<IResponseData<Discount>>(`/api/v1/discount`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/discount"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo giảm giá
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-full flex flex-col gap-4">
                  <Input
                    errorMessage={errors.id?.message}
                    {...register("id", {
                      required: "Mã không được để trống",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mã"
                  />
                  <Input
                    errorMessage={errors.description?.message}
                    {...register("description", {
                      required: "Mô tả không được để trống",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mô tả"
                  />
                  <Input
                    errorMessage={errors.start_date?.message}
                    {...register("start_date", {
                      required: "Ngày bắt đầu không được để trống",
                    })}
                    placeholder="dd/mm/yyyy"
                    date-format="dd/mm/yyyy"
                    type="date"
                    variant="bordered"
                    size={"md"}
                    label="Ngày bắt đầu"
                  />
                  <Input
                    errorMessage={errors.end_date?.message}
                    {...register("end_date", {
                      required: "Ngày kết thúc không được để trống",
                    })}
                    placeholder="dd/mm/yyyy"
                    date-format="dd/mm/yyyy"
                    type="date"
                    variant="bordered"
                    size={"md"}
                    label="Ngày kết thúc"
                  />
                  <Input
                    errorMessage={errors.percentage?.message}
                    {...register("percentage", {
                      required: "Phần trăm không được để trống",
                      min: {
                        value: 0,
                        message: "Phần trăm không được nhỏ hơn 0",
                      },
                      max: {
                        value: 100,
                        message: "Phần trăm không được lớn hơn 100",
                      },
                    })}
                    type="number"
                    variant="bordered"
                    size={"md"}
                    label="Phần trăm giảm"
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
