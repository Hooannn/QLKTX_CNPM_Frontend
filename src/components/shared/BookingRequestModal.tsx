import { AiOutlineClose } from "react-icons/ai";
import {
  BookingTime,
  IResponseData,
  Region,
  Role,
  Room,
  Booking,
  IUser,
  Discount,
} from "../../types";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Stepper from "react-stepper-horizontal";
import useAuthStore from "../../stores/auth";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RegionCard, { RegionCardHeader } from "../../pages/RoomsPage/RegionCard";
import { useState } from "react";
import { SEX_MAP } from "../../utils/map";
import dayjs from "../../libs/dayjs";
import toast from "react-hot-toast";
import { priceFormat } from "../../utils/priceFormat";
import { onError } from "../../utils/error-handlers";
import StaffStudentsPage from "../../pages/StaffStudentsPage";

type CreateBookingInputs = {
  booking_time_id: number;
  room_id: string;
  student_id: string;
  discount_id?: string;
  auto_create_invoice: boolean;
};
export default function BookingRequestModal(props: {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom?: Room;
}) {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<IUser | undefined>();
  const [selectedTime, setSelectedTime] = useState<BookingTime | undefined>();
  const [activeStep, setActiveStep] = useState(0);

  const next = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prev = () => {
    setActiveStep((prev) => prev - 1);
  };

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: (params: CreateBookingInputs) => {
      return axios.post<IResponseData<Booking>>(`/api/v1/booking`, params);
    },
    onError,
    onSuccess(data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries(["fetch/currentBookings"]);
      props.onClose();
    },
  });

  const steps = [
    {
      title: "Chọn phòng",
      content: (
        <ChooseRoomStep
          onRoomSelected={(room) => {
            setSelectedRoom(room);
            next();
          }}
        />
      ),
    },
    {
      title: "Chọn sinh viên",
      content: (
        <ChooseStudentStep
          selectedRoom={selectedRoom}
          onBack={() => {
            setSelectedRoom(undefined);
            prev();
          }}
          onNext={(student) => {
            setSelectedStudent(student);
            next();
          }}
        />
      ),
    },
    {
      title: "Chọn thời gian thuê",
      content: (
        <FormStep
          selectedStudent={selectedStudent}
          selectedRoom={selectedRoom}
          onBack={() => {
            setSelectedStudent(undefined);
            prev();
          }}
          onNext={(time) => {
            setSelectedTime(time?.bookingTime);
            next();
          }}
        />
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <ConfirmStep
          selectedStudent={selectedStudent}
          selectedTime={selectedTime}
          selectedRoom={selectedRoom}
          onBack={() => {
            prev();
          }}
          onNext={({ discount, autoCreateInvoice }) => {
            if (selectedRoom && selectedTime && selectedStudent) {
              createBookingMutation.mutate({
                room_id: selectedRoom.id,
                booking_time_id: selectedTime.id,
                student_id: selectedStudent.id,
                discount_id: discount?.id ?? undefined,
                auto_create_invoice: autoCreateInvoice,
              });
            } else {
              toast.error("Có lỗi xảy ra");
            }
          }}
        />
      ),
    },
  ];
  return (
    <>
      <Modal
        size="full"
        hideCloseButton
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-4">
                <Button size="lg" onClick={props.onClose} isIconOnly>
                  <AiOutlineClose />
                </Button>
                Tạo phiếu thuê mới
              </ModalHeader>
              <ModalBody className="overflow-auto">
                <div className="flex flex-col pb-3 gap-3">
                  <Stepper steps={steps} activeStep={activeStep} />
                  {steps[activeStep].content}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function ChooseRoomStep({
  onRoomSelected,
}: {
  onRoomSelected: (room: Room) => void;
}) {
  const { user } = useAuthStore();
  const isStaff = user?.role === Role.STAFF;
  const axios = useAxiosIns();
  const getRegionsQuery = useQuery({
    queryKey: ["fetch/regions"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Region[]>>(`/api/v1/regions`);
    },
  });

  const getRoomsQuery = useQuery({
    queryKey: ["fetch/rooms"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Room[]>>(`/api/v1/rooms`);
    },
  });

  const regions = getRegionsQuery.data?.data?.data ?? [];
  const rooms = getRoomsQuery.data?.data?.data ?? [];
  const isLoading = getRegionsQuery.isLoading || getRoomsQuery.isLoading;

  const getRegionsWithRooms = () => {
    return regions.map((region) => {
      const regionRooms = rooms.filter((room) => room.region.id === region.id);
      return {
        ...region,
        rooms: regionRooms,
      };
    });
  };
  return (
    <div className="mx-auto w-full max-w-[1200px]">
      {isLoading ? (
        <>
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg"></Spinner>
          </div>
        </>
      ) : (
        <>
          {regions.length === 0 ? (
            <div className="flex items-center flex-col justify-center py-20">
              <Image width={200} src="/Empty.svg"></Image>
              <div className="text-sm py-4">Không có dãy phòng nào</div>
            </div>
          ) : (
            <>
              <div className="font-semibold text-lg px-3 pb-3">Chọn phòng</div>
              <Accordion
                defaultExpandedKeys={"all"}
                selectionMode="multiple"
                variant="splitted"
              >
                {getRegionsWithRooms().map((region) => (
                  <AccordionItem
                    key={region.id}
                    title={<RegionCardHeader isReadonly region={region} />}
                  >
                    <RegionCard
                      isReadOnly
                      isStaff={isStaff}
                      regions={getRegionsWithRooms()}
                      region={region}
                      onRoomClicked={onRoomSelected}
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ChooseStudentStep({
  onNext,
  onBack,
  selectedRoom,
}: {
  selectedRoom?: Room;
  onNext: (student: IUser) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex justify-between items-center w-full">
        <div>
          <div>
            Dãy:{" "}
            <span className="font-semibold">{selectedRoom?.region.name}</span>
          </div>
          <div>
            Giới tính:{" "}
            <span className="font-semibold">
              {SEX_MAP[selectedRoom?.region.sex ?? "OTHER"]}
            </span>
          </div>
          <div>
            Phòng: <span className="font-semibold">{selectedRoom?.id}</span>
          </div>
        </div>
        <div>
          <Button color="primary" size="sm" onClick={onBack} variant="flat">
            Quay lại
          </Button>
        </div>
      </div>
      <StaffStudentsPage
        selectable
        onSelected={(student) => {
          onNext(student);
        }}
        filter={selectedRoom?.region.sex}
        title="Chọn sinh viên"
      />
    </div>
  );
}

function FormStep({
  selectedRoom,
  selectedStudent,
  onBack,
  onNext,
}: {
  selectedRoom?: Room;
  selectedStudent?: IUser;
  onBack: () => void;
  onNext: (params: { bookingTime?: BookingTime }) => void;
}) {
  const [selectedTime, setSelectedTime] = useState<string>();
  const { user } = useAuthStore();
  const axios = useAxiosIns();
  const getBookingTimeQuery = useQuery({
    queryKey: ["fetch/booking-time/available"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<BookingTime[]>>(
        `/api/v1/booking/booking-time/available`
      );
    },
    onSuccess(data) {
      if (data.data?.data?.length > 0) {
        setSelectedTime(data.data?.data?.[0].id.toString());
      }
    },
  });

  const bookingTimes = getBookingTimeQuery.data?.data?.data ?? [];
  return (
    <Card shadow="sm" radius="sm" className="mx-auto w-full max-w-[720px]">
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-semibold">Điền thông tin</div>
          <div>
            <Button color="primary" size="sm" onClick={onBack} variant="flat">
              Quay lại
            </Button>
          </div>
        </div>
      </CardHeader>
      {getBookingTimeQuery.isLoading ? (
        <CardBody className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </CardBody>
      ) : (
        <>
          {bookingTimes.length > 0 ? (
            <>
              <CardBody className="gap-4">
                <div>
                  <div className="text-base">Thông tin dãy</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Dãy</div>{" "}
                    <div>{selectedRoom?.region.name}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Giới tính</div>
                    <div className="text-right">
                      {SEX_MAP[selectedRoom?.region.sex ?? "OTHER"]}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-base">Thông tin phòng</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Phòng</div>{" "}
                    <div>{selectedRoom?.id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Đơn giá</div>
                    <div className="text-right">{selectedRoom?.type.price}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Số giường</div>
                    <div className="text-right">
                      {selectedRoom?.type.capacity}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-base">Thông tin quản lý nhận phòng</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Mã quản lý</div>{" "}
                    <div>{user?.id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Tên</div>
                    <div className="text-right">
                      {user?.first_name} {user?.last_name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Giới tính</div>
                    <div className="text-right">
                      {SEX_MAP[user?.sex ?? "OTHER"]}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-base">Thông tin sinh viên</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Mã sinh viên</div>{" "}
                    <div>{selectedStudent?.id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Tên</div>
                    <div className="text-right">
                      {selectedStudent?.first_name} {selectedStudent?.last_name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Giới tính</div>
                    <div className="text-right">
                      {SEX_MAP[selectedStudent?.sex ?? "OTHER"]}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-base">Thời gian thuê</div>
                  <small>
                    *Từ{" "}
                    {dayjs(
                      bookingTimes.find(
                        (time) => time.id.toString() === (selectedTime ?? "")
                      )?.start_date
                    ).format("DD/MM/YYYY")}{" "}
                    -{" "}
                    {dayjs(
                      bookingTimes.find(
                        (time) => time.id.toString() === (selectedTime ?? "")
                      )?.end_date
                    ).format("DD/MM/YYYY")}
                  </small>
                  <Select
                    onSelectionChange={(key) => {
                      const keyArray = Array.from(key);
                      const k = keyArray[0];
                      setSelectedTime(k.toString());
                    }}
                    selectedKeys={[selectedTime ?? ""]}
                    value={selectedTime}
                    size="sm"
                  >
                    {bookingTimes.map((bookingTime) => (
                      <SelectItem
                        key={bookingTime.id}
                        value={bookingTime.description}
                      >
                        {bookingTime.description}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex justify-center w-full">
                  <Button
                    size="lg"
                    color="primary"
                    className="w-1/2"
                    onClick={() =>
                      onNext({
                        bookingTime: bookingTimes.find(
                          (time) => time.id.toString() === (selectedTime ?? "")
                        ),
                      })
                    }
                  >
                    Tiếp theo
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <CardBody className="flex items-center justify-center py-20">
              <small>Hiện tại không có đợt thuê nào phù hợp</small>
            </CardBody>
          )}
        </>
      )}
    </Card>
  );
}

function ConfirmStep({
  selectedTime,
  selectedRoom,
  selectedStudent,
  onBack,
  onNext,
}: {
  selectedTime?: BookingTime;
  selectedRoom?: Room;
  selectedStudent?: IUser;
  onBack: () => void;
  onNext: (params: { discount?: Discount; autoCreateInvoice: boolean }) => void;
}) {
  const { user } = useAuthStore();

  const [selectedDiscount, setSelectedDiscount] = useState<
    Discount | undefined
  >();

  const [autoCreateInvoice, setAutoCreateInvoice] = useState(true);

  const axios = useAxiosIns();

  const getDiscountQuery = useQuery({
    queryKey: ["fetch/availableDiscount"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Discount[]>>(`/api/v1/discount/available`);
    },
  });

  const getBookingPriceQuery = useQuery({
    queryKey: [
      "fetch/bookingPrice",
      selectedRoom?.id,
      selectedTime?.id,
      selectedDiscount?.id,
    ],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (!selectedRoom || !selectedTime) return null;
      return axios.get<IResponseData<number>>(`/api/v1/booking/price`, {
        params: {
          room_id: selectedRoom?.id,
          booking_time_id: selectedTime?.id,
          discount_id: selectedDiscount?.id,
        },
      });
    },
  });

  const discounts = getDiscountQuery.data?.data?.data ?? [];
  const price = getBookingPriceQuery.data?.data?.data ?? 0;

  const isLoading = getDiscountQuery.isLoading;
  const isCalculatingPrice = getBookingPriceQuery.isLoading;
  return (
    <Card shadow="sm" radius="sm" className="mx-auto w-full max-w-[720px]">
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-semibold">Xác nhận</div>
          <div>
            <Button color="primary" size="sm" onClick={onBack} variant="flat">
              Quay lại
            </Button>
          </div>
        </div>
      </CardHeader>
      {isLoading ? (
        <>
          <CardBody>
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          </CardBody>
        </>
      ) : (
        <>
          <CardBody className="gap-4">
            <div>
              <div className="text-base">Thông tin dãy</div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Dãy</div>{" "}
                <div>{selectedRoom?.region.name}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Giới tính</div>
                <div className="text-right">
                  {SEX_MAP[selectedRoom?.region.sex ?? "OTHER"]}
                </div>
              </div>
            </div>
            <div>
              <div className="text-base">Thông tin phòng</div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Phòng</div>{" "}
                <div>{selectedRoom?.id}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Đơn giá</div>
                <div className="text-right">
                  {priceFormat(selectedRoom?.type.price ?? 0)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Số giường</div>
                <div className="text-right">{selectedRoom?.type.capacity}</div>
              </div>
            </div>
            <div>
              <div className="text-base">Thông tin quản lý nhận phòng</div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Mã quản lý</div>{" "}
                <div>{user?.id}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Tên</div>
                <div className="text-right">
                  {user?.first_name} {user?.last_name}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Giới tính</div>
                <div className="text-right">
                  {SEX_MAP[user?.sex ?? "OTHER"]}
                </div>
              </div>
            </div>
            <div>
              <div className="text-base">Thông tin sinh viên</div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Mã sinh viên</div>{" "}
                <div>{selectedStudent?.id}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Tên</div>
                <div className="text-right">
                  {selectedStudent?.first_name} {selectedStudent?.last_name}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm opacity-80">Giới tính</div>
                <div className="text-right">
                  {SEX_MAP[selectedStudent?.sex ?? "OTHER"]}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-base">Thời gian thuê</div>
              <div className="text-right flex flex-col">
                <div>{selectedTime?.description}</div>
                <div>
                  {dayjs(selectedTime?.start_date).format("DD/MM/YYYY")} -{" "}
                  {dayjs(selectedTime?.end_date).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>

            <div>
              <div className="text-base">Áp dụng giảm giá</div>
              <Select
                items={discounts}
                onSelectionChange={(key) => {
                  const keyArray = Array.from(key);
                  const k = keyArray[0];
                  setSelectedDiscount(discounts.find((d) => d.id === k));
                }}
                placeholder="Chọn giảm giá (nếu có)"
                size="sm"
                renderValue={(items) => {
                  return items.map((item) => (
                    <div className="flex flex-col">
                      {item.data?.description}
                      <small>Phần trăm giảm: {item.data?.percentage}%</small>
                    </div>
                  ));
                }}
              >
                {(discount) => (
                  <SelectItem key={discount.id} value={discount.id}>
                    <div className="flex flex-col">
                      {discount.description}
                      <small>Phần trăm giảm: {discount.percentage}%</small>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-base flex flex-col">
                <div>Giá tiền</div>
              </div>
              <div className="text-right text-lg font-semibold">
                {isCalculatingPrice ? (
                  <div className="flex items-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  priceFormat(price)
                )}
              </div>
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <div className="flex justify-center w-full gap-4 items-center">
              <div className="w-1/2">
                <Checkbox
                  isSelected={autoCreateInvoice}
                  onValueChange={setAutoCreateInvoice}
                  color="primary"
                  defaultSelected
                >
                  Tự động tạo hóa đơn
                  <br />
                  <small>
                    Hóa đơn sẽ được tạo tự động khi phiếu thuê được tạo
                  </small>
                </Checkbox>
              </div>
              <Button
                size="lg"
                isDisabled={isCalculatingPrice}
                color="primary"
                className="w-1/2"
                onClick={() => {
                  onNext({
                    discount: selectedDiscount,
                    autoCreateInvoice,
                  });
                }}
              >
                Xác nhận
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
