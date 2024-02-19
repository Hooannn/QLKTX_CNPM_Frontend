import { Tabs, Tab } from "@nextui-org/tabs";
import BookingRequestTab from "../../components/shared/BookingRequestTab";
import ChangeRoomRequestTab from "../../components/shared/ChangeRoomRequestTab";
import ExtensionRequestTab from "../../components/shared/ExtensionRequestTab";
export default function StaffRequestsPage() {
  return (
    <>
      <Tabs color="primary" variant="underlined">
        <Tab key="booking" title="Yêu cầu thuê">
          <BookingRequestTab />
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
