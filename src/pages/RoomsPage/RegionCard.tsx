import { Button, Image, useDisclosure } from "@nextui-org/react";
import { Region, Room } from "../../types";
import RoomCard from "./RoomCard";
import DeleteRegionModal from "./DeleteRegionModal";
import CreateRoomModal from "./CreateRoomModal";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import UpdateRegionModal from "./UpdateRegionModal";

export default function RegionCard({
  isReadOnly = false,
  isStaff,
  region,
  regions,
  onRoomClicked,
}: {
  isReadOnly?: boolean;
  isStaff: boolean;
  region: Region;
  regions: Region[];
  onRoomClicked?: (room: Room) => void;
}) {
  const {
    isOpen: isDeleteRegionModalOpen,
    onOpen: onOpenDeleteRegionModal,
    onClose: onDeleteRegionModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onOpenCreateRoomModal,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();
  return (
    <>
      <DeleteRegionModal
        isOpen={isDeleteRegionModalOpen}
        onClose={onDeleteRegionModalClose}
        region={region}
      />
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={onCreateRoomModalClose}
        defaultRegion={region}
        regions={regions}
      />
      {region.rooms.length === 0 ? (
        <div className="flex items-center flex-col gap-2">
          <Image src="/Empty_Noti.svg" width={150} />
          <small>Dãy này hiện tại chưa có phòng</small>
          {isStaff && !isReadOnly && (
            <div className="flex gap-2">
              <Button
                onClick={onOpenCreateRoomModal}
                className="w-28"
                color="primary"
                variant="flat"
              >
                Thêm phòng
              </Button>
              <Button
                onClick={onOpenDeleteRegionModal}
                className="w-28"
                color="danger"
                variant="flat"
              >
                Xóa dãy
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 px-1">
          {region.rooms.map((room) => (
            <RoomCard
              onRoomClicked={onRoomClicked}
              key={room.id}
              room={room}
              isStaff={isStaff}
            />
          ))}

          {isStaff && !isReadOnly && (
            <Button
              onClick={onOpenCreateRoomModal}
              className="h-36 w-40"
              color="primary"
              variant="flat"
            >
              <AiOutlinePlus />
              Thêm phòng
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export function RegionCardHeader({
  region,
  isReadonly = false,
}: {
  region: Region;
  isReadonly?: boolean;
}) {
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onOpenUpdateModal,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  return (
    <>
      <UpdateRegionModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        region={region}
      />
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {region.sex === "MALE" ? (
            <div className="rounded-full bg-sky-500 p-2 text-white">
              <IoIosMale size={24} />
            </div>
          ) : (
            <div className="rounded-full bg-pink-300 p-2 text-white">
              <IoIosFemale size={24} />
            </div>
          )}
          <div>
            <div className="text-lg font-bold">{region.name}</div>
            <div className="text-sm opacity-70">
              {region.rooms.length} phòng
            </div>
          </div>
        </div>
        {!isReadonly && (
          <Button
            onClick={onOpenUpdateModal}
            size="sm"
            color="primary"
            variant="light"
          >
            Chỉnh sửa
          </Button>
        )}
      </div>
    </>
  );
}
