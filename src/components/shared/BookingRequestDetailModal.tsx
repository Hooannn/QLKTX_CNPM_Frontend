import { BookingRequest, RequestStatus } from "../../types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
  CardBody,
  Card,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";
import useAuthStore from "../../stores/auth";
import { SEX_MAP } from "../../utils/map";
import { priceFormat } from "../../utils/priceFormat";
import dayjs from "../../libs/dayjs";
import CancelRequestModal from "./CancelRequestModal";
export default function BookingRequestDetailModal(props: {
  bookingRequest: BookingRequest;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const isOwner = props.bookingRequest.student.id === user?.id;

  const {
    isOpen: isCancelRequestModalOpen,
    onOpen: onOpenCancelRequestModal,
    onClose: onCloseCancelRequestModal,
  } = useDisclosure();
  return (
    <>
      {isOwner && (
        <CancelRequestModal
          isOpen={isCancelRequestModalOpen}
          onClose={onCloseCancelRequestModal}
          bookingRequest={props.bookingRequest}
          onCanceled={props.onClose}
        />
      )}
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
                Thông tin chi tiết
              </ModalHeader>
              <ModalBody className="overflow-auto">
                <div className="flex flex-col pb-3 gap-3">
                  <Card
                    shadow="sm"
                    radius="sm"
                    className="mx-auto w-full max-w-[500px]"
                  >
                    <CardBody className="gap-4">
                      <div>
                        <div className="text-base">Thông tin phòng</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Phòng</div>{" "}
                          <div>{props.bookingRequest.room.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Giới tính</div>
                          <div className="text-right">
                            {SEX_MAP[props.bookingRequest.room.type.sex]}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Đơn giá</div>
                          <div className="text-right">
                            {priceFormat(props.bookingRequest.room.type.price)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Số giường</div>
                          <div className="text-right">
                            {props.bookingRequest.room.type.capacity}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-base">Thông tin sinh viên</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Mã sinh viên</div>{" "}
                          <div>{props.bookingRequest.student.id}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Tên</div>
                          <div className="text-right">
                            {props.bookingRequest.student.first_name}{" "}
                            {props.bookingRequest.student.last_name}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm opacity-80">Giới tính</div>
                          <div className="text-right">
                            {SEX_MAP[props.bookingRequest.student.sex]}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-base">Thời gian thuê</div>
                        <div className="text-right flex flex-col">
                          <div>
                            {props.bookingRequest.booking_time.description}
                          </div>
                          <div>
                            {dayjs(
                              props.bookingRequest.booking_time?.start_date
                            ).format("DD/MM/YYYY")}{" "}
                            -{" "}
                            {dayjs(
                              props.bookingRequest.booking_time?.end_date
                            ).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    <Divider />
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                {isOwner &&
                  props.bookingRequest.status === RequestStatus.WAITING && (
                    <Button
                      size="lg"
                      color="danger"
                      variant="flat"
                      onClick={onOpenCancelRequestModal}
                    >
                      Huỷ yêu cầu
                    </Button>
                  )}

                {!isOwner &&
                  props.bookingRequest.status === RequestStatus.WAITING && (
                    <>
                      <Button
                        size="lg"
                        color="danger"
                        variant="flat"
                        onClick={props.onClose}
                      >
                        Từ chối
                      </Button>
                      <Button
                        size="lg"
                        color="success"
                        variant="flat"
                        onClick={props.onClose}
                      >
                        Chấp nhận
                      </Button>
                    </>
                  )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
