import {
  Accordion,
  AccordionItem,
  Button,
  Image,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { IResponseData, Region, Role } from "../../types";
import CreateRegionModal from "./CreateRegionModal";
import RegionCard from "./RegionCard";
import useAuthStore from "../../stores/auth";

export default function RoomsPage() {
  const { user } = useAuthStore();
  const isStaff = user?.role === Role.STAFF
  const axios = useAxiosIns();
  const getRegionsQuery = useQuery({
    queryKey: ["fetch/regions"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<IResponseData<Region[]>>(`/api/v1/regions`);
    },
  });

  const regions = getRegionsQuery.data?.data?.data ?? [];

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
          {isStaff && <div className="flex gap-4">
            <Button
              onClick={onOpenCreateRegionModal}
              className="h-12"
              color="primary"
            >
              Thêm dãy phòng
            </Button>
          </div>}
        </div>
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
                      <RegionCard isStaff={isStaff} regions={regions} region={region} />
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
