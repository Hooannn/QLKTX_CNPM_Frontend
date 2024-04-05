import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import dayjs from "dayjs";
import useAuthStore from "../../stores/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { IResponseData, IUser, Role } from "../../types";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useMutation } from "@tanstack/react-query";
import { onError } from "../../utils/error-handlers";
import toast from "react-hot-toast";
type UpdateProfileInputs = {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone: string;
  address?: string;
  sex: string;
};
export default function InformationTab() {
  const { user, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInputs>();

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    if (!data.date_of_birth) delete data.date_of_birth;
    else data.date_of_birth = dayjs(data.date_of_birth).toISOString();

    await updateProfileMutation.mutateAsync(data);
  };
  const axios = useAxiosIns();

  const isValidDate = (dateString: string) => {
    if (!dateString) return true;
    return dayjs(dateString, "MM/DD/YYYY", true).isValid();
  };

  const updateProfileMutation = useMutation({
    mutationFn: (params: UpdateProfileInputs) =>
      axios.put<IResponseData<IUser>>(
        user?.account.role.role === Role.STUDENT
          ? `/api/v1/students/profile`
          : `/api/v1/staffs/profile`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message);
      const user = data.data.data;
      setUser(user);
    },
  });
  return (
    <div>
      <div className="w-1/2 h-full flex gap-4 mx-auto">
        <div className="flex flex-col gap-4 w-full">
          <Input
            defaultValue={user?.id}
            isDisabled
            variant="bordered"
            size={"md"}
            label="Mã nhân viên"
          />
          <Input
            isDisabled
            defaultValue={user?.account.email}
            variant="bordered"
            size={"md"}
            label="Email"
          />
          <Input
            defaultValue={user?.first_name}
            errorMessage={errors.first_name?.message}
            {...register("first_name", {
              required: "Tên là bắt buộc",
            })}
            variant="bordered"
            size={"md"}
            label="Tên"
          />
          <Input
            defaultValue={user?.last_name}
            errorMessage={errors.last_name?.message}
            {...register("last_name", {
              required: "Họ là bắt buộc",
            })}
            variant="bordered"
            size={"md"}
            label="Họ"
          />
          <Input
            defaultValue={user?.phone}
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
            defaultValue={user?.address}
            {...register("address", {
              required: false,
            })}
            variant="bordered"
            size={"md"}
            label="Địa chỉ (tùy chọn)"
          />
          <Input
            defaultValue={
              user?.date_of_birth
                ? dayjs(user?.date_of_birth).format("MM/DD/YYYY")
                : ""
            }
            errorMessage={errors.date_of_birth?.message}
            {...register("date_of_birth", {
              validate: {
                validDate: (value) =>
                  isValidDate(value ?? "") ||
                  "Ngày sinh phải đúng định dạng (mm/dd/yyyy)",
              },
            })}
            variant="bordered"
            size={"md"}
            label="Ngày sinh (tùy chọn)"
          />
          <Select
            errorMessage={errors.sex?.message}
            {...register("sex", {
              required: "Giới tính là bắt buộc",
            })}
            defaultSelectedKeys={[user?.sex]}
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

          <Button
            isLoading={updateProfileMutation.isLoading}
            color="primary"
            onClick={handleSubmit(onSubmit)}
            size="lg"
            className="py-6"
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}
