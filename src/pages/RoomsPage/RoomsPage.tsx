import {
  Accordion,
  AccordionItem,
  Button,
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { IResponseData, Region, Role, Room } from "../../types";
import CreateRegionModal from "./CreateRegionModal";
import RegionCard, { RegionCardHeader } from "./RegionCard";
import useAuthStore from "../../stores/auth";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";

export default function RoomsPage() {
  const { user } = useAuthStore();
  const isStaff =
    user?.account.role.role === Role.STAFF ||
    user?.account.role.role === Role.ADMIN;
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

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const shouldShowLookupRooms = searchKeyword.trim().length > 0;

  const [selectedSex, setSelectedSex] = useState<string>("ALL");

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

  const filterRegionsWithRooms = () => {
    const regionWithRooms = shouldShowLookupRooms
      ? getRegionsWithRooms().filter((region) =>
        region.rooms.some((room) =>
          room.id.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      )
      : getRegionsWithRooms();
    return regionWithRooms.filter((region) => {
      if (selectedSex !== "ALL") return region.sex === selectedSex;
      return true;
    });
  };

  const {
    isOpen: isCreateRegionModalOpen,
    onOpen: onOpenCreateRegionModal,
    onClose: onCreateRegionModalClose,
  } = useDisclosure();
  return (
    <>
      <CreateRegionModal
        isOpen={isCreateRegionModalOpen}
        onClose={onCreateRegionModalClose}
      />
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="text-lg font-bold">Phòng và dãy phòng</div>
          <div>
            <div className="flex gap-4">
              <div className="w-60">
                <Input
                  value={searchKeyword}
                  onValueChange={(value) => setSearchKeyword(value)}
                  color="primary"
                  variant="bordered"
                  label="Tìm kiếm bằng mã phòng"
                  isClearable
                  size="sm"
                  className="h-12 w-full"
                  placeholder="Nhập từ khóa..."
                  startContent={
                    <AiOutlineSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <Select
                disallowEmptySelection
                onSelectionChange={(selection) => {
                  const keys = Array.from(selection) as string[];
                  setSelectedSex(keys[0]?.toString());
                }}
                color="primary"
                className="w-40 h-12"
                size="sm"
                variant="bordered"
                defaultSelectedKeys={[selectedSex]}
                label="Giới tính"
              >
                <SelectItem key="ALL" value="ALL">
                  Tất cả
                </SelectItem>
                <SelectItem key="MALE" value="MALE">
                  Nam
                </SelectItem>
                <SelectItem key="FEMALE" value="FEMALE">
                  Nữ
                </SelectItem>
              </Select>
              {isStaff && (
                <div className="flex gap-4">
                  <Button
                    onClick={onOpenCreateRegionModal}
                    className="h-12"
                    color="primary"
                  >
                    Thêm dãy phòng
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <>
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg"></Spinner>
              </div>
            </>
          ) : (
            <>
              {filterRegionsWithRooms().length === 0 ? (
                <div className="flex items-center flex-col justify-center py-20">
                  <Image width={200} src="/Empty.svg"></Image>
                  <div className="text-sm py-4">Không có dãy phòng nào</div>
                </div>
              ) : (
                <Accordion
                  defaultExpandedKeys={"all"}
                  selectionMode="multiple"
                  variant="splitted"
                >
                  {filterRegionsWithRooms().map((region) => (
                    <AccordionItem
                      key={region.id}
                      title={
                        <RegionCardHeader
                          region={region}
                          isReadonly={!isStaff}
                        />
                      }
                    >
                      <RegionCard
                        isStaff={isStaff}
                        regions={getRegionsWithRooms()}
                        region={region}
                      />
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
