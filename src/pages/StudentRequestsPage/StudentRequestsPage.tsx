import { Tabs, Tab } from "@nextui-org/react";
import BookingRequestTab from "../../components/shared/BookingRequestTab";
import ChangeRoomRequestTab from "../../components/shared/ChangeRoomRequestTab";
import ExtensionRequestTab from "../../components/shared/ExtensionRequestTab";
import useAuthStore from "../../stores/auth";

export default function StudentRequestsPage() {
  const { user } = useAuthStore();
  return (
    <>
      <Tabs color="primary" variant="underlined">
        <Tab key="booking" title="Yêu cầu thuê">
          <BookingRequestTab studentId={user?.id} />
        </Tab>
        <Tab key="changeRoom" title="Yêu cầu chuyển phòng">
          <ChangeRoomRequestTab />
        </Tab>
        <Tab key="extension" title="Yêu cầu gia hạn">
          <ExtensionRequestTab />
        </Tab>
      </Tabs>
    </>
  );
}
