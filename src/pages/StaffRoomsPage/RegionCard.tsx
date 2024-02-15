import { Button, Image, useDisclosure } from "@nextui-org/react";
import { Region } from "../../types";
import RoomCard from "./RoomCard";
import DeleteRegionModal from "./DeleteRegionModal";
import CreateRoomModal from "./CreateRoomModal";
import { AiOutlinePlus } from "react-icons/ai";

export default function RegionCard({
  region,
  regions,
}: {
  region: Region;
  regions: Region[];
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
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 px-1">
          {region.rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}

          <Button
            onClick={onOpenCreateRoomModal}
            className="h-36 w-36"
            color="primary"
            variant="flat"
          >
            <AiOutlinePlus />
            Thêm phòng
          </Button>
        </div>
      )}
    </>
  );
}
