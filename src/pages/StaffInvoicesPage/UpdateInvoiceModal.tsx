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
import { IResponseData, Invoice } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../libs/dayjs";

type UpdateInputs = {
  paid_at?: string;
  total: number;
};

export default function UpdateInvoiceModal(props: {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onUpdated: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateInputs>();

  const onSubmit: SubmitHandler<UpdateInputs> = async (data) => {
    await updateMutation.mutateAsync(data);
    props.onUpdated();
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (params: UpdateInputs) =>
      axios.put<IResponseData<unknown>>(
        `/api/v1/invoice/${props.invoice.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/unpaidInvoices"]);
    },
  });
  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sửa hoá đơn
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    errorMessage={errors.paid_at?.message}
                    {...register("paid_at", {
                      required: "Ngày thanh toán là bắt buộc",
                    })}
                    defaultValue={
                      props.invoice.paid_at
                        ? dayjs(props.invoice.paid_at)
                            .format("YYYY-MM-DD")
                            .toString()
                        : undefined
                    }
                    max={new Date().toISOString().split("T")[0]}
                    placeholder="dd/mm/yyyy"
                    date-format="dd/mm/yyyy"
                    type="date"
                    variant="bordered"
                    size={"md"}
                    label="Ngày thanh toán"
                  />
                  <Input
                    defaultValue={props.invoice.total.toString()}
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
                  isLoading={updateMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={updateMutation.isLoading}
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  Cập nhật
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
