import { AiOutlineClose } from "react-icons/ai";
import { Booking, IResponseData, Room } from "../../types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CurrentBookingsTab from "./CurrentBookingsTab";
import { SEX_MAP, STATUS_MAP } from "../../utils/map";
import { priceFormat } from "../../utils/priceFormat";
import CheckedOutTab from "../StaffBookingsPage/CheckedOutTab";
import RoomActions from "./RoomActions";
export default function RoomDetailModal(props: {
  isOpen: boolean;
  isStaff: boolean;
  onClose: () => void;
  room: Room;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const getDetailQuery = useQuery({
    queryKey: ["fetch/roomDetail", props.room.id],
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
    queryFn: () => {
      return axios.get<IResponseData<Room>>(`/api/v1/rooms/${props.room.id}`);
    },
  });

  const getCurrentBookingsQuery = useQuery({
    queryKey: ["fetch/currentBookingsByRoom", props.room.id],
    refetchOnWindowFocus: false,
    enabled: props.isOpen,
    queryFn: () => {
      return axios.get<IResponseData<Booking[]>>(
        `/api/v1/booking/room/${props.room.id}`
      );
    },
  });

  const bookings = getCurrentBookingsQuery.data?.data?.data || [];
  const roomDetail = getDetailQuery.data?.data?.data;

  const isLoading =
    getDetailQuery.isLoading || getCurrentBookingsQuery.isLoading;
  return (
    <>
      <Modal
        size="full"
        hideCloseButton
        isDismissable={false}
        scrollBehavior="outside"
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
              <ModalBody className="flex-row bg-white">
                {isLoading ? (
                  <div className="w-full flex justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <>
                    <div className="h-full flex flex-col justify-between items-center w-[500px] border-r-1 border-gray pr-5">
                      <div className="w-full flex flex-col gap-3 items-center">
                        <div className="w-full">
                          <div>Thông tin phòng</div>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Mã phòng</div>{" "}
                              <div>{roomDetail?.id}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Trạng thái</div>{" "}
                              <div>
                                {STATUS_MAP[roomDetail?.status ?? "AVAILABLE"]}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div>Thông tin dãy</div>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Tên dãy</div>{" "}
                              <div>{roomDetail?.region.name}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Dành cho</div>{" "}
                              <div>
                                {SEX_MAP[roomDetail?.region.sex ?? "OTHER"]}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div>Thông tin loại phòng</div>
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Tên loại phòng</div>{" "}
                              <div>{roomDetail?.type.name}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Số giường</div>{" "}
                              <div>{roomDetail?.type.capacity}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Đang lưu trú</div>{" "}
                              <div>{bookings.length}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="opacity-70">Đơn giá</div>{" "}
                              <div>
                                {priceFormat(roomDetail?.type.price ?? 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center flex-col justify-center w-full py-4">
                        <RoomActions
                          onDeleted={() => {
                            props.onClose();
                            queryClient.invalidateQueries(["fetch/rooms"]);
                          }}
                          onUpdated={() => {
                            queryClient.invalidateQueries([
                              "fetch/roomDetail",
                              props.room.id,
                            ]);
                            queryClient.invalidateQueries(["fetch/rooms"]);
                          }}
                          room={roomDetail}
                        />
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <Tabs color="primary" variant="underlined">
                        <Tab key="current" title="Lưu trú hiện tại">
                          <CurrentBookingsTab bookings={bookings} />
                        </Tab>
                        <Tab key="all" title="Các phiếu thuê trước đây">
                          <CheckedOutTab room={props.room} />
                        </Tab>
                      </Tabs>
                    </div>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
