import { AiOutlineClose } from "react-icons/ai";
import {
  BookingTime,
  IResponseData,
  Region,
  Role,
  Room,
  BookingRequest,
} from "../../types";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import RegionCard from "../RoomsPage/RegionCard";
import { useState } from "react";
import { SEX_MAP } from "../../utils/map";
import dayjs from "../../libs/dayjs";
import toast from "react-hot-toast";
import { priceFormat } from "../../utils/priceFormat";
import { onError } from "../../utils/error-handlers";

export default function BookingRequestModal(props: {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom?: Room;
}) {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [selectedTime, setSelectedTime] = useState<BookingTime | undefined>();

  const [activeStep, setActiveStep] = useState(0);

  const next = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prev = () => {
    setActiveStep((prev) => prev - 1);
  };

  const axios = useAxiosIns();

  const bookingRequestMutation = useMutation({
    mutationFn: (params: { room_id: string; booking_time_id: number }) => {
      return axios.post<IResponseData<BookingRequest>>(
        `/api/v1/booking/request`,
        params
      );
    },
    onError,
    onSuccess(data) {
      toast.success(data.data.message);
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
      title: "Điền thông tin",
      content: (
        <FormStep
          selectedRoom={selectedRoom}
          onBack={() => {
            setSelectedRoom(undefined);
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
          selectedTime={selectedTime}
          selectedRoom={selectedRoom}
          onBack={() => {
            prev();
          }}
          onNext={() => {
            if (selectedRoom && selectedTime) {
              bookingRequestMutation.mutate({
                room_id: selectedRoom.id,
                booking_time_id: selectedTime.id,
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
                Yêu cầu thuê phòng
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

  const regions = getRegionsQuery.data?.data?.data ?? [];
  return (
    <div>
      {getRegionsQuery.isLoading ? (
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
              <div className="font-semibold text-lg px-3 pb-3">
                Chọn phòng bạn muốn thuê
              </div>
              <Accordion
                defaultExpandedKeys={"all"}
                selectionMode="multiple"
                variant="splitted"
              >
                {regions.map((region) => (
                  <AccordionItem
                    key={region.id}
                    aria-label={`Dãy ${region.id}`}
                    title={`Dãy ${region.id}`}
                  >
                    <RegionCard
                      onRoomClicked={onRoomSelected}
                      isStaff={isStaff}
                      regions={regions}
                      region={region}
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

function FormStep({
  selectedRoom,
  onBack,
  onNext,
}: {
  selectedRoom?: Room;
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
    <Card shadow="sm" radius="sm" className="mx-auto w-full max-w-[500px]">
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
                  <div className="text-base">Thông tin phòng</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Phòng</div>{" "}
                    <div>{selectedRoom?.id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Giới tính</div>
                    <div className="text-right">
                      {SEX_MAP[selectedRoom?.type.sex ?? "OTHER"]}
                    </div>
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
                  <div className="text-base">Thông tin sinh viên</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">Mã sinh viên</div>{" "}
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
  onBack,
  onNext,
}: {
  selectedTime?: BookingTime;
  selectedRoom?: Room;
  onBack: () => void;
  onNext: () => void;
}) {
  const { user } = useAuthStore();
  const getTempPrice = () => {
    const bookingMonths = dayjs(selectedTime?.end_date)
      .diff(selectedTime?.start_date, "month", true)
      .toFixed(1);
    return priceFormat(
      (selectedRoom?.type.price ?? 0) * parseFloat(bookingMonths)
    );
  };
  return (
    <Card shadow="sm" radius="sm" className="mx-auto w-full max-w-[500px]">
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
      <CardBody className="gap-4">
        <div>
          <div className="text-base">Thông tin phòng</div>
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-80">Phòng</div>{" "}
            <div>{selectedRoom?.id}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-80">Giới tính</div>
            <div className="text-right">
              {SEX_MAP[selectedRoom?.type.sex ?? "OTHER"]}
            </div>
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
          <div className="text-base">Thông tin sinh viên</div>
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-80">Mã sinh viên</div>{" "}
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
            <div className="text-right">{SEX_MAP[user?.sex ?? "OTHER"]}</div>
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

        <div className="flex items-center justify-between">
          <div className="text-base flex flex-col">
            <div>Giá tiền (tạm tính)</div>
            <small className="text-xs">*Giá tiền thực tế có thể nhỏ hơn</small>
          </div>
          <div className="text-right text-lg font-semibold">
            {getTempPrice()}
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex justify-center w-full gap-4 items-center">
          <small className="w-1/2">
            *Sau khi xác nhận, yêu cầu của bạn sẽ được gửi đến quản lý phòng,
            vui lòng chờ phản hồi.
            <br></br>
            <strong>
              Bạn có thể hủy yêu cầu bất cứ lúc nào trước khi được duyệt.
            </strong>
          </small>
          <Button size="lg" color="primary" className="w-1/2" onClick={onNext}>
            Xác nhận
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
