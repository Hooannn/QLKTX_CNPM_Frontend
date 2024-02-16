import { AiOutlineClose } from "react-icons/ai";
import { IResponseData, Region, Role, Room } from "../../types";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import { useQuery } from "@tanstack/react-query";
import RegionCard from "../RoomsPage/RegionCard";
import { useState } from "react";
import { SEX_MAP, STATUS_MAP } from "../../utils/map";
import toast from "react-hot-toast";

export default function BookingRequestModal(props: {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom?: Room;
}) {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const [activeStep, setActiveStep] = useState(0);

  const next = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prev = () => {
    setActiveStep((prev) => prev - 1);
  };

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
          onNext={() => {
            next();
          }}
        />
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <ConfirmStep
          selectedRoom={selectedRoom}
          onBack={() => {
            prev();
          }}
          onNext={() => {
            toast.success("Yêu cầu của bạn đã được gửi đi");
            props.onClose();
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
  onNext: () => void;
}) {
  const { user } = useAuthStore();
  const timeOptions = [
    {
      label: "Học kỳ 1",
      value: "1",
    },
    {
      label: "Học kỳ 2",
      value: "2",
    },
    {
      label: "Học kỳ 3",
      value: "3",
    },
    {
      label: "Học kỳ 1 + Học kỳ 2",
      value: "12",
    },
    {
      label: "Học kỳ 2 + Học kỳ 3",
      value: "23",
    },
    {
      label: "Học kỳ 1 + Học kỳ 2 + Học kỳ 3",
      value: "123",
    },
  ];
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
        </div>
        <div>
          <div className="text-base">
            Thời gian thuê (năm {new Date().getFullYear()})
          </div>
          <div className="flex flex-col py-1">
            <small className="text-xs">*Học kỳ 1: từ 1/8 đến 23/12</small>
            <small className="text-xs">*Học kỳ 2: từ 1/1 đến 23/5</small>
            <small className="text-xs">*Học kỳ 3: từ 1/6 đến 23/7</small>
          </div>
          <Select defaultSelectedKeys={["1"]} size="sm" className="pt-2">
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-center w-full">
          <Button size="lg" color="primary" className="w-1/2" onClick={onNext}>
            Tiếp theo
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function ConfirmStep({
  selectedRoom,
  onBack,
  onNext,
}: {
  selectedRoom?: Room;
  onBack: () => void;
  onNext: () => void;
}) {
  const { user } = useAuthStore();
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
            <div className="text-right">{selectedRoom?.type.price}</div>
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
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base">
            Thời gian thuê (năm {new Date().getFullYear()})
          </div>
          <div className="text-right">Học kỳ 1 + Học kỳ 2</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base">Giá tiền (tạm tính)</div>
          <div className="text-right text-lg font-semibold">2.000.000đ</div>
        </div>
      </CardBody>
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
