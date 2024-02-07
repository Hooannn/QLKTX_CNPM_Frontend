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
import { useState } from "react";
import toast from "react-hot-toast";
import { IResponseData, IUser } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function CreateUserModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (params: { name: string }) =>
      axios.post<IResponseData<IUser>>(`/api/v1/users`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      queryClient.invalidateQueries(["fetch/users"]);
    },
  });

  const create = async () => {
    await createUserMutation.mutateAsync({ name });
    props.onClose();
  };

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
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Mã người dùng"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Tên"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Họ"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Email"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      type="password"
                      label="Mật khẩu đăng nhập"
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Số điện thoại (tùy chọn)"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Địa chỉ (tùy chọn)"
                    />
                    <Input
                      value={name}
                      onValueChange={(v) => setName(v)}
                      variant="bordered"
                      size={"md"}
                      label="Ngày sinh (tùy chọn)"
                    />
                    <Select variant="bordered" label="Giới tính" size="md">
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
                    <Select variant="bordered" label="Quyền" size="md">
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
                  onPress={create}
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
