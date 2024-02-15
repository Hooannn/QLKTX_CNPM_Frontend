import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IResponseData, RoomType } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateRoomTypeInputs = {
  name: string;
  capacity: number;
  sex: string;
  price: number;
};

export default function CreateRoomTypeModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomTypeInputs>();

  const onSubmit: SubmitHandler<CreateRoomTypeInputs> = async (data) => {
    await createRoomTypeMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createRoomTypeMutation = useMutation({
    mutationFn: (params: CreateRoomTypeInputs) =>
      axios.post<IResponseData<RoomType>>(`/api/v1/room-types`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/room-types"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo loại phòng
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    errorMessage={errors.name?.message}
                    {...register("name", {
                      required: "Tên loại phòng là bắt buộc",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Tên loại phòng"
                  />
                  <Input
                    errorMessage={errors.capacity?.message}
                    {...register("capacity", {
                      required: "Sức chứa là bắt buộc",
                      min: {
                        value: 1,
                        message: "Sức chứa phải lớn hơn 0",
                      },
                      max: {
                        value: 12,
                        message: "Sức chứa phải nhỏ hơn 13",
                      },
                    })}
                    type="number"
                    variant="bordered"
                    size={"md"}
                    label="Sức chứa"
                  />
                  <Input
                    errorMessage={errors.price?.message}
                    {...register("price", {
                      required: "Giá phòng là bắt buộc",
                      min: {
                        value: 1000,
                        message: "Giá phòng phải lớn hơn 1000",
                      },
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Giá phòng"
                  />
                  <Select
                    errorMessage={errors.sex?.message}
                    {...register("sex", {
                      required: "Giới tính là bắt buộc",
                    })}
                    variant="bordered"
                    label="Giới tính"
                    size="md"
                  >
                    <SelectItem key="MALE" value="MALE">
                      Nam
                    </SelectItem>
                    <SelectItem key="FEMALE" value="FEMALE">
                      Nữ
                    </SelectItem>
                    <SelectItem key="OTHER" value="OTHER">
                      Khác
                    </SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createRoomTypeMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={createRoomTypeMutation.isLoading}
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
