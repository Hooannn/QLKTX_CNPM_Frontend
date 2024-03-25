import useAxiosIns from '../../hooks/useAxiosIns';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IResponseData } from '../../types';
import { onError } from '../../utils/error-handlers';
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
type ChangePasswordInputs = {
    current_password: string;
    new_password: string;
    cf_new_password: string;
};
export default function ChangePasswordTab() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordInputs>();
    const watchPassword = watch("new_password", "");

    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility2 = () => setIsVisible2(!isVisible2);
    const toggleVisibility3 = () => setIsVisible3(!isVisible3);

    const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
        await changePasswordMutation.mutateAsync(data);
    };
    const axios = useAxiosIns();

    const changePasswordMutation = useMutation({
        mutationFn: (params: ChangePasswordInputs) => {
            return axios.post<IResponseData<unknown>>(
                `/api/v1/password/change`,
                {
                    current_password: params.current_password,
                    new_password: params.new_password,
                }
            )
        },
        onError,
        onSuccess(data) {
            toast.success(data.data?.message);
        },
    });
    return (
        <div>
            <div className="w-1/2 h-full flex gap-4 mx-auto">
                <div className="flex flex-col gap-4 w-full">
                    <Input
                        errorMessage={errors.current_password?.message}
                        {...register("current_password", {
                            required: "Mật khẩu không được để trống",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                        })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(onSubmit)();
                            }
                        }}
                        color="primary"
                        label="Mật khẩu hiện tại"
                        variant="bordered"
                        placeholder="Nhập mật khẩu hiện tại của bạn"
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                    />

                    <Input
                        errorMessage={errors.new_password?.message}
                        {...register("new_password", {
                            required: "Mật khẩu không được để trống",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                        })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(onSubmit)();
                            }
                        }}
                        color="primary"
                        label="Mật khẩu mới"
                        variant="bordered"
                        placeholder="Nhập mật khẩu mới của bạn"
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility2}
                            >
                                {isVisible ? (
                                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                    />

                    <Input
                        errorMessage={errors.cf_new_password?.message}
                        {...register("cf_new_password", {
                            required: "Mật khẩu không được để trống",
                            validate: (value) =>
                                value === watchPassword || "Mật khẩu không khớp",
                        })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(onSubmit)();
                            }
                        }}
                        color="primary"
                        label="Nhập lại mật khẩu mới"
                        variant="bordered"
                        placeholder="Nhập lại mật khẩu mới của bạn"
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility3}
                            >
                                {isVisible3 ? (
                                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible3 ? "text" : "password"}
                    />

                    <Button isLoading={changePasswordMutation.isLoading}
                        color="primary"
                        onClick={handleSubmit(onSubmit)} size='lg' className='py-6'>
                        Cập nhật
                    </Button>
                </div>
            </div>
        </div>
    )
}
