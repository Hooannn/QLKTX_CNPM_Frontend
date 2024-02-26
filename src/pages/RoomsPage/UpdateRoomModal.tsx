import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Discount, IResponseData, Region, Room, RoomType } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
type UpdateInputs = {
  region_id: string;
  type_id: number;
  status: string;
};

export default function UpdateRoomModal(props: {
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
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

  const updateMutation = useMutation({
    mutationFn: (params: UpdateInputs) =>
      axios.put<IResponseData<Discount>>(
        `/api/v1/rooms/${props.room?.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
    },
  });

  const getRoomTypesQuery = useQuery({
    queryKey: ["fetch/room-types"],
    queryFn: () => axios.get<IResponseData<RoomType[]>>("/api/v1/room-types"),
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
  });

  const getRegionsQuery = useQuery({
    queryKey: ["fetch/regions"],
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
    queryFn: () => {
      return axios.get<IResponseData<Region[]>>(`/api/v1/regions`);
    },
  });

  const roomTypes = getRoomTypesQuery.data?.data?.data || [];
  const regions = getRegionsQuery.data?.data?.data || [];

  const isLoading = getRoomTypesQuery.isLoading || getRegionsQuery.isLoading;
  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sửa thông tin phòng
              </ModalHeader>
              {isLoading ? (
                <ModalBody>
                  <div className="w-full h-full flex justify-center items-center py-20">
                    <Spinner size="lg" />
                  </div>
                </ModalBody>
              ) : (
                <>
                  <ModalBody>
                    <div className="w-full h-full flex flex-col gap-4">
                      <Select
                        errorMessage={errors.type_id?.message}
                        defaultSelectedKeys={
                          props.room ? [props.room?.type.id.toString()] : []
                        }
                        {...register("type_id", {
                          required: "Loại phòng là bắt buộc",
                        })}
                        variant="bordered"
                        label="Loại phòng"
                        size="md"
                      >
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        defaultSelectedKeys={
                          props.room ? [props.room?.region.id] : undefined
                        }
                        errorMessage={errors.region_id?.message}
                        {...register("region_id", {
                          required: "Dãy phòng là bắt buộc",
                        })}
                        variant="bordered"
                        label="Dãy phòng"
                        size="md"
                      >
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {`${region.name}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        defaultSelectedKeys={
                          props.room ? [props.room?.status] : undefined
                        }
                        errorMessage={errors.status?.message}
                        {...register("status", {
                          required: "Trạng thái là bắt buộc",
                        })}
                        variant="bordered"
                        label="Trạng thái"
                        size="md"
                      >
                        <SelectItem key={"AVAILABLE"} value={"AVAILABLE"}>
                          Đang hoạt động
                        </SelectItem>
                        <SelectItem key={"MAINTAINING"} value={"MAINTAINING"}>
                          Bảo trì
                        </SelectItem>
                      </Select>
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
                      Câp nhật
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
