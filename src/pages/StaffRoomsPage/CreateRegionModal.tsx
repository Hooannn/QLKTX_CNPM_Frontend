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
import { IResponseData, Region } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateRegionInputs = {
  id: string;
};

export default function CreateRegionModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRegionInputs>();

  const onSubmit: SubmitHandler<CreateRegionInputs> = async (data) => {
    await createMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (params: CreateRegionInputs) =>
      axios.post<IResponseData<Region>>(`/api/v1/regions`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/regions"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo dãy phòng
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    errorMessage={errors.id?.message}
                    {...register("id", {
                      required: "Mã dãy phòng không được để trống",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Mã dãy phòng"
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
