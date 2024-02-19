import { Card, CardBody } from "@nextui-org/card";
import { Room } from "../../types";
import RoomDetailModal from "./RoomDetailModal";
import { useDisclosure } from "@nextui-org/react";
import { SEX_MAP, STATUS_MAP } from "../../utils/map";
import { priceFormat } from "../../utils/priceFormat";
export default function RoomCard({
  onRoomClicked,
  room,
  isStaff,
}: {
  onRoomClicked?: (room: Room) => void;
  isStaff: boolean;
  room: Room;
}) {
  const {
    isOpen: isDetailModalOpen,
    onOpen: onOpenDetailModal,
    onClose: onDetailModalClose,
  } = useDisclosure();
  return (
    <>
      <RoomDetailModal
        room={room}
        isStaff={isStaff}
        isOpen={isDetailModalOpen}
        onClose={onDetailModalClose}
      />
      <Card
        isPressable
        onPress={() => {
          onRoomClicked ? onRoomClicked(room) : onOpenDetailModal();
        }}
        shadow="none"
        radius="sm"
        className="h-36 w-40 border-2"
      >
        <CardBody className="items-center justify-center">
          <div className="font-semibold text-sm pb-3">{room.id}</div>
          <div className="w-full">
            <div className="flex items-center justify-between text-xs">
              <div>Giới tính</div>
              <div className="text-right">{SEX_MAP[room.type.sex]}</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>Đơn giá</div>
              <div className="text-right">{priceFormat(room.type.price)}</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>Số giường</div>
              <div className="text-right">{room.type.capacity}</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>Đang thuê</div>
              <div className="text-right">0</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>Trạng thái</div>
              <div className="text-right">{STATUS_MAP[room.status]}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
