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
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IResponseData, IUser } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
type CreateAccountInputs = {
  username: string;
  email: string;
  password: string;
  role: string;
  user_id: string;
};

export default function CreateAccountModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountInputs>();

  const onSubmit: SubmitHandler<CreateAccountInputs> = async (data) => {
    await createAccountMutation.mutateAsync(data);
    props.onClose();
  };

  const [selectedRole, setSelectedRole] = useState<string>("");
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createAccountMutation = useMutation({
    mutationFn: (params: CreateAccountInputs) =>
      axios.post<IResponseData<IUser>>(`/api/v1/accounts`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/accounts-management"]);
    },
  });

  const getStudentsQuery = useQuery({
    queryKey: ["fetch/students-management/non-account"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(`/api/v1/students/non-account`);
    },
  });

  const getStaffsQuery = useQuery({
    queryKey: ["fetch/staffs-management/non-account"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<IUser[]>>(`/api/v1/staffs/non-account`);
    },
  });

  const staffs = getStaffsQuery.data?.data?.data ?? [];
  const students = getStudentsQuery.data?.data?.data ?? [];

  const getUsers = () => {
    if (!selectedRole) return [];
    if (selectedRole === "STUDENT") return students;
    return staffs;
  };

  const isLoading = getStudentsQuery.isLoading || getStaffsQuery.isLoading;

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo tài khoản mới
              </ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div className="w-full flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="w-full h-full flex gap-4 flex-col">
                    <Input
                      errorMessage={errors.username?.message}
                      {...register("username", {
                        required: "Tên đăng nhập là bắt buộc",
                      })}
                      variant="bordered"
                      size={"md"}
                      label="Tên đăng nhập"
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
                        minLength: {
                          value: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự",
                        },
                      })}
                      variant="bordered"
                      type="password"
                      size={"md"}
                      label="Mật khẩu"
                    />
                    <Select
                      errorMessage={errors.role?.message}
                      {...register("role", {
                        required: "Vai trò là bắt buộc",
                      })}
                      variant="bordered"
                      onSelectionChange={(selection) => {
                        const keys = Array.from(selection) as string[];
                        setSelectedRole(keys[0]?.toString());
                      }}
                      label="Vai trò"
                      size="md"
                    >
                      <SelectItem key="ADMIN" value="ADMIN">
                        Quản lý
                      </SelectItem>
                      <SelectItem key="STAFF" value="STAFF">
                        Nhân viên
                      </SelectItem>
                      <SelectItem key="STUDENT" value="STUDENT">
                        Sinh viên
                      </SelectItem>
                    </Select>
                    {selectedRole && (
                      <Select
                        errorMessage={
                          getUsers().length === 0
                            ? "Hiện tại không có người dùng phù hợp để mở tài khoản "
                            : errors.user_id?.message
                        }
                        {...register("user_id", {
                          required: "Người dùng là bắt buộc",
                        })}
                        variant="bordered"
                        label="Mở tài khoản cho người dùng"
                        size="md"
                        disabled={getUsers().length === 0}
                        items={getUsers()}
                        renderValue={(items) => {
                          return items.map((item) => (
                            <div key={item.key}>
                              {item.data?.id} - {item.data?.first_name}{" "}
                              {item.data?.last_name}
                            </div>
                          ));
                        }}
                      >
                        {(user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.id} - {user.first_name} {user.last_name}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createAccountMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={createAccountMutation.isLoading}
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
