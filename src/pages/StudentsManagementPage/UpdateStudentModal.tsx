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
import { IResponseData, IUser } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../libs/dayjs";
type UpdateUserInputs = {
  first_name: string;
  last_name: string;
  password: string;
  date_of_birth?: string;
  phone: string;
  email: string;
  address?: string;
  sex: string;
};

export default function UpdateUserModal(props: {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInputs>();

  const onSubmit: SubmitHandler<UpdateUserInputs> = async (data) => {
    await createUserMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (params: UpdateUserInputs) =>
      axios.put<IResponseData<IUser>>(
        `/api/v1/students/${props.user.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/students-management"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cập nhật sinh viên
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-full flex gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      defaultValue={props.user.id}
                      isDisabled
                      variant="bordered"
                      size={"md"}
                      label="Mã sinh viên"
                    />
                    <Input
                      defaultValue={props.user.first_name}
                      errorMessage={errors.first_name?.message}
                      {...register("first_name", {
                        required: "Tên là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Tên"
                    />
                    <Input
                      defaultValue={props.user.last_name}
                      errorMessage={errors.last_name?.message}
                      {...register("last_name", {
                        required: "Họ là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Họ"
                    />
                    <Input
                      defaultValue={props.user.email}
                      errorMessage={errors.email?.message}
                      {...register("email", {
                        required: "Email là bắt buộc",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Email không hợp lệ",
                        },
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Email"
                    />
                    <Input
                      errorMessage={errors.password?.message}
                      {...register("password", {
                        required: false,
                      })}
                      variant="bordered"
                      size={"md"}
                      type="password"
                      label="Cài lại mật khẩu"
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      defaultValue={props.user.phone}
                      errorMessage={errors.phone?.message}
                      {...register("phone", {
                        required: "Số điện thoại là bắt buộc",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Số điện thoại"
                    />
                    <Input
                      defaultValue={props.user.address}
                      {...register("address", {
                        required: false,
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Địa chỉ (tùy chọn)"
                    />
                    <Input
                      defaultValue={
                        props.user.date_of_birth
                          ? dayjs(props.user.date_of_birth).format("YYYY-MM-DD")
                          : ""
                      }
                      errorMessage={errors.date_of_birth?.message}
                      {...register("date_of_birth", {
                        required: "Ngày sinh là bắt buộc",
                      })}
                      placeholder="dd/mm/yyyy"
                      date-format="dd/mm/yyyy"
                      max={new Date().toISOString().split("T")[0]}
                      type="date"
                      variant="bordered"
                      size={"md"}
                      label="Ngày sinh (tùy chọn)"
                    />
                    <Select
                      errorMessage={errors.sex?.message}
                      {...register("sex", {
                        required: "Giới tính là bắt buộc",
                      })}
                      defaultSelectedKeys={[props.user.sex]}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createUserMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={createUserMutation.isLoading}
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
