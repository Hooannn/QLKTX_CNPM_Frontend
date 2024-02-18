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
import { BookingTime, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../libs/dayjs";
type CreateInputs = {
    start_date: string;
    end_date: string;
    description: string;
    open: string;
};

export default function CreateBookingTimeModal(props: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateInputs>();

    const onSubmit: SubmitHandler<CreateInputs> = async (data) => {
        data.start_date = dayjs(data.start_date).toISOString();
        data.end_date = dayjs(data.end_date).toISOString();
        await createUserMutation.mutateAsync({ ...data, open: data.open === "yes" });
        props.onClose();
    };

    const axios = useAxiosIns();
    const queryClient = useQueryClient();

    const isValidDate = (dateString: string) => {
        if (!dateString) return true;
        return dayjs(dateString, "MM/DD/YYYY", true).isValid();
    };

    const createUserMutation = useMutation({
        mutationFn: (params: {
            start_date: string;
            end_date: string;
            description: string;
            open: boolean;
        }) =>
            axios.post<IResponseData<BookingTime>>(`/api/v1/booking/booking-time`, params),
        onError,
        onSuccess(data) {
            toast.success(data.data?.message);
            queryClient.invalidateQueries(["fetch/booking-time"]);
        },
    });

    return (
        <>
            <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Tạo thời gian thuê mới
                            </ModalHeader>
                            <ModalBody>
                                <div className="w-full h-full flex flex-col gap-4">
                                    <Input
                                        {...register('description', {
                                            required: "Mô tả không được để trống",
                                        })}
                                        variant="bordered"
                                        size={"md"}
                                        label="Mô tả"
                                    />
                                    <Input
                                        errorMessage={errors.start_date?.message}
                                        {...register('start_date', {
                                            validate: {
                                                validDate: (value) =>
                                                    isValidDate(value ?? "") ||
                                                    "Ngày phải đúng định dạng (mm/dd/yyyy)",
                                            },
                                        })}
                                        placeholder="mm/dd/yyyy"
                                        variant="bordered"
                                        size={"md"}
                                        label="Ngày bắt đầu (tùy chọn)"
                                    />
                                    <Input
                                        errorMessage={errors.end_date?.message}
                                        {...register('end_date', {
                                            validate: {
                                                validDate: (value) =>
                                                    isValidDate(value ?? "") ||
                                                    "Ngày phải đúng định dạng (mm/dd/yyyy)",
                                            },
                                        })}
                                        placeholder="mm/dd/yyyy"
                                        variant="bordered"
                                        size={"md"}
                                        label="Ngày kết thúc (tùy chọn)"
                                    />
                                    <Select
                                        errorMessage={errors.open?.message}
                                        defaultSelectedKeys={['yes']}
                                        {...register('open', {
                                            required: "Trạng thái mở là bắt buộc",
                                        })}
                                        variant="bordered"
                                        label="Đang mở"
                                        size="md"
                                    >
                                        <SelectItem key="yes" value={1}>
                                            Có
                                        </SelectItem>
                                        <SelectItem key="no" value={0}>
                                            Không
                                        </SelectItem>
                                    </Select>
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
