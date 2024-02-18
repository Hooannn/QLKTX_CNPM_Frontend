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
type CreateUserInputs = {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  date_of_birth?: string;
  phone: string;
  address?: string;
  sex: string;
  role: string;
};

export default function CreateUserModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInputs>();

  const onSubmit: SubmitHandler<CreateUserInputs> = async (data) => {
    if (!data.date_of_birth) delete data.date_of_birth;
    else data.date_of_birth = dayjs(data.date_of_birth).toISOString();
    await createUserMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const isValidDate = (dateString: string) => {
    if (!dateString) return true;
    return dayjs(dateString, "MM/DD/YYYY", true).isValid();
  };

  const createUserMutation = useMutation({
    mutationFn: (params: CreateUserInputs) =>
      axios.post<IResponseData<IUser>>(`/api/v1/users`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/users"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo người dùng mới
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-full flex gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      errorMessage={errors.id?.message}
                      {...register("id", {
                        required: "Mã người dùng là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Mã người dùng"
                    />
                    <Input
                      errorMessage={errors.first_name?.message}
                      {...register("first_name", {
                        required: "Tên là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Tên"
                    />
                    <Input
                      errorMessage={errors.last_name?.message}
                      {...register("last_name", {
                        required: "Họ là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Họ"
                    />
                    <Input
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
                        required: "Mật khẩu là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      type="password"
                      label="Mật khẩu đăng nhập"
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Input
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
                      {...register("address", {
                        required: false,
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Địa chỉ (tùy chọn)"
                    />
                    <Input
                      errorMessage={errors.date_of_birth?.message}
                      {...register("date_of_birth", {
                        validate: {
                          validDate: (value) =>
                            isValidDate(value ?? "") ||
                            "Ngày sinh phải đúng định dạng (mm/dd/yyyy)",
                        },
                      })}
                      placeholder="mm/dd/yyyy"
                      variant="bordered"
                      size={"md"}
                      label="Ngày sinh (tùy chọn)"
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
                    <Select
                      errorMessage={errors.role?.message}
                      {...register("role", {
                        required: "Quyền là bắt buộc",
                      })}
                      variant="bordered"
                      label="Quyền"
                      size="md"
                    >
                      <SelectItem key="STUDENT" value="STUDENT">
                        Sinh viên
                      </SelectItem>
                      <SelectItem key="STAFF" value="STAFF">
                        Quản lý
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
