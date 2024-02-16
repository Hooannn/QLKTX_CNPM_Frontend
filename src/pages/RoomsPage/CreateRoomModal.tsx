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
  Spinner,
  Image,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IResponseData, Region, Room, RoomType } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type CreateRoomInputs = {
  id: string;
  type_id: number;
  region_id: string;
};

export default function CreateRoomModal(props: {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  defaultRegion: Region;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomInputs>();
  const axios = useAxiosIns();

  const getRoomTypesQuery = useQuery({
    queryKey: ["fetch/room-types"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<RoomType[]>>(`/api/v1/room-types`);
    },
  });

  const roomTypes = getRoomTypesQuery.data?.data?.data ?? [];

  const onSubmit: SubmitHandler<CreateRoomInputs> = async (data) => {
    await createRoomMutation.mutateAsync(data);
    props.onClose();
  };

  const queryClient = useQueryClient();

  const createRoomMutation = useMutation({
    mutationFn: (params: CreateRoomInputs) =>
      axios.post<IResponseData<Room>>(`/api/v1/rooms`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/regions"]);
    },
  });

  const navigate = useNavigate();
  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              {getRoomTypesQuery.isLoading ? (
                <div className="h-[50vh] w-full flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  {roomTypes.length === 0 ? (
                    <div className="flex flex-col items-center h-[50vh] justify-center gap-4">
                      <Image src="/Empty_Noti.svg" width={150} />
                      <small>
                        Không có loại phòng nào trong hệ thống,
                        <br />
                        để tạo phòng vui lòng tạo loại phòng trước
                      </small>
                      <Button
                        onClick={() => {
                          props.onClose();
                          navigate("/staff/room-types");
                        }}
                        className="w-28"
                        color="primary"
                        variant="flat"
                      >
                        Tạo loại phòng
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Tạo phòng
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col gap-4 w-full">
                          <Input
                            errorMessage={errors.id?.message}
                            {...register("id", {
                              required: "Mã phòng là bắt buộc",
                            })}
                            variant="bordered"
                            size={"md"}
                            label="Mã phòng"
                          />
                          <Select
                            errorMessage={errors.type_id?.message}
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
                            defaultSelectedKeys={[props.defaultRegion.id]}
                            errorMessage={errors.region_id?.message}
                            {...register("region_id", {
                              required: "Dãy phòng là bắt buộc",
                            })}
                            variant="bordered"
                            label="Dãy phòng"
                            size="md"
                          >
                            {props.regions.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {`${region.id}`}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          isLoading={createRoomMutation.isLoading}
                          variant="light"
                          onPress={props.onClose}
                        >
                          Đóng
                        </Button>
                        <Button
                          isLoading={createRoomMutation.isLoading}
                          color="primary"
                          onClick={handleSubmit(onSubmit)}
                        >
                          Tạo
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
