import { Tabs, Tab } from "@nextui-org/tabs";
import BookingRequestTab from "./BookingRequestTab";
import ChangeRoomRequestTab from "./ChangeRoomRequestTab";
import ExtensionRequestTab from "./ExtensionRequestTab";
export default function StaffRequestsPage() {
  return <>
    <Tabs color="primary" variant='underlined'>
      <Tab
        key="booking"
        title='Yêu cầu thuê'
      >
        <BookingRequestTab />
      </Tab>
      <Tab
        key="changeRoom"
        title='Yêu cầu chuyển phòng'
      >
        <ChangeRoomRequestTab />
      </Tab>
      <Tab
        key="extension"
        title='Yêu cầu gia hạn'
      >
        <ExtensionRequestTab />
      </Tab>
    </Tabs>
  </>;
}
