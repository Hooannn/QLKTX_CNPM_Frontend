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
import { Account, IResponseData, IUser } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
type UpdateAccountInputs = {
  username: string;
  email: string;
  password: string;
};

export default function UpdateAccountModal(props: {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAccountInputs>();

  const onSubmit: SubmitHandler<UpdateAccountInputs> = async (data) => {
    await updateAccountMutation.mutateAsync(data);
    props.onClose();
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const updateAccountMutation = useMutation({
    mutationFn: (params: UpdateAccountInputs) =>
      axios.put<IResponseData<IUser>>(`/api/v1/accounts`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/accounts-management"]);
    },
  });

  return (
    <>
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cập nhật tài khoản
              </ModalHeader>
              <ModalBody>
                <div className="w-full h-full flex gap-4 flex-col">
                  <Input
                    errorMessage={errors.username?.message}
                    defaultValue={props.account.username}
                    {...register("username", {
                      required: "Tên đăng nhập là bắt buộc",
                    })}
                    variant="bordered"
                    size={"md"}
                    label="Tên đăng nhập"
                  />
                  <Input
                    errorMessage={errors.email?.message}
                    defaultValue={props.account.email}
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
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    variant="bordered"
                    type="password"
                    size={"md"}
                    label="Cài lại mật khẩu"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={updateAccountMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Đóng
                </Button>
                <Button
                  isLoading={updateAccountMutation.isLoading}
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
